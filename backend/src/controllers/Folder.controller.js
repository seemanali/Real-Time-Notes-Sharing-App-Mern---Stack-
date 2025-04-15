import Folder from "../models/Folder.model.js"
import Note from "../models/Note.model.js";
import { apiError, apiResponse } from "../Utlis/ApiResponse.js";
import mongoose from "mongoose";

const FolderCreate = async (req, res) => {

    try {
        const folderResponse = await Folder.create({
            name: req.params.folderName || "No Name",
            owner: req.user?._id,
            ownerMail: req.user?.email

        });


        if (folderResponse) {
            apiResponse(res, 200, "Folder Created SuccessFully!", folderResponse)
        }
    } catch (error) {
        return apiError(res, 400, error._message)
    }
}
const ListFolders = async (req, res) => {
    try {
        let response = await Folder.find({ owner: req.user._id }).sort({ createdAt: -1 }).exec();
        apiResponse(res, 200, "Folders Fetch SuccessFully", response)
    } catch (error) {
        console.log(error)
    }
}

const GetFolder = async (req, res) => {
    const folderId = req.params?.folderId;

    // ✅ Validate Folder ID
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return apiError(res, 400, "Invalid Folder ID", "Please provide a valid folder ID.");
    }

    try {

        const folder = await Folder.findById(folderId).populate("owner");
        if (!folder) {
            return apiError(res, 404, "Folder Not Found", "No folder exists with the given ID.");
        }

        if (folder.owner.email !== req.user.email) {
            return apiError(res, 401, "Unauthorized Access", "You are not allowed to view this folder.");
        }

        const notes = await Note.find({ folder: folderId }).populate("folder").sort({ createdAt: -1 }).exec();

        // ✅ Return the folder details & its notes
        return apiResponse(res, 200, "Folder Fetched Successfully", { folder, notes });
    } catch (error) {
        console.error("Error fetching folder:", error);
        return apiError(res, 500, "Something Went Wrong", "Please try again later.");
    }
};

const renameFolder = async (req, res) => {
    const folderId = req.params?.folderId;
    const newName = req.params?.newName; // Use req.body instead of req.params

    // Validate Folder ID
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return apiError(res, 400, "Invalid Folder ID", "Please provide a valid folder ID.");
    }

    try {
        // Fetch folder to check ownership
        const folder = await Folder.findById(folderId).populate("owner");

        if (!folder) {
            return apiError(res, 404, "Folder Not Found", "No folder exists with the given ID.");
        }

        // Check if the logged-in user owns the folder
        if (folder.owner.email !== req.user.email) {
            return apiError(res, 401, "Unauthorized Access", "You are not allowed to rename this folder.");
        }

        // Rename folder
        const response = await Folder.findByIdAndUpdate(
            folderId,
            { name: newName || "Untitled Folder" },
            { new: true, runValidators: true }
        );

        if (response) {
            return apiResponse(res, 200, "Folder Renamed Successfully!", response);
        } else {
            return apiError(res, 500, "Folder Rename Failed", "Something went wrong while renaming the folder.");
        }
    } catch (error) {
        console.error("Error renaming folder:", error);
        return apiError(res, 500, "Something Went Wrong", "Please try again later.");
    }
};

const DeleteFolder = async (req, res) => {
    const folderId = req.params?.folderId;

    // Validate the folder ID
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return apiError(res, 400, "Invalid Folder ID", "Please send a valid folder ID.");
    }

    try {
        // Fetch the folder to verify ownership
        const folder = await Folder.findById(folderId).populate("owner");

        if (!folder) {
            return apiError(res, 404, "Folder Not Found", "No folder exists with the given ID.");
        }

        // Check if the logged-in user is the owner
        if (folder.owner.email !== req.user.email) {
            return apiError(res, 401, "Unauthorized Access", "You do not have permission to delete this folder.");
        }

        // Delete the folder
        const FolderResponse = await Folder.findByIdAndDelete(folderId);
        const NotesResponse = await Note.deleteMany({ folder: folderId });

        if (FolderResponse && NotesResponse.acknowledged) {
            return apiResponse(res, 200, "Folder Deleted Successfully", { deletedNotes: NotesResponse.deletedCount });
        } else {
            return apiError(res, 500, "Failed to delete folder", "Something went wrong while deleting the folder.");
        }
    } catch (error) {
        console.error("Error deleting folder:", error);
        return apiError(res, 500, "Something Went Wrong", "Please try again later.");
    }
};

const ShareFolderToggle = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return apiError(res, 400, "Invalid Document ID", "The provided document ID is not valid.");
        }

        // Fetch the folder first to check ownership
        const existingFolder = await Folder.findById(req.params.id).populate("owner");

        // If folder not found
        if (!existingFolder) {
            return apiError(res, 400, "Folder Not Found", "No folder exists with the given ID.");
        }

        if (existingFolder.owner.email !== req.user.email) {
            return apiError(res, 401, "Unauthorized Access", "You are not allowed to modify this folder.");
        }

        const updatedFolder = await Folder.findByIdAndUpdate(
            req.params.id,
            [{ $set: { urlAccess: { $not: "$urlAccess" } } }],
            { new: true, runValidators: true }
        );

        return apiResponse(res, 200, "Folder shareability toggled!", updatedFolder, `Folder shareability via link: ${updatedFolder.urlAccess}`);
    } catch (error) {
        console.error("Error in toggling folder:", error);
        return apiError(res, 500, "Something Went Wrong. Please try again later.");
    }
};

const GetPublicNote = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
        return apiError(res, 400, "Invalid Folder ID", "Please provide a valid folder ID.");
    }

    try {
        const response = await Folder.findById(req.params?.id);
        if (!response) {
            return apiError(res, 400, "The document with requested Id is not found", "The document with requested Id is not found");
        }

        if (!response.urlAccess) {
            return apiError(res, 401, "UnAuthorized Access", "This document is not publiclly available. Ask the owner to make it public.");
        }

        const responseForNote = await Note.find(
            { folder: req.params.id }
        );
        const filteredNotesWithId = responseForNote.map((note, index) => {
            return {
                id: index + 1,  // Increment ID, starting from 1
                title: note.title,
                content: note.content
            };
        });

        return apiResponse(res, 200, "Public folder Fetched SuccessFully", {
            folderDetails: response,
            Notes: filteredNotesWithId
        });



    } catch (error) {
        console.error("Error in Geting public folder:", error);
        return apiError(res, 500, "Something Went Wrong. Please try again later.");
    }
}

const updateShareStatus = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
        return apiError(res, 400, "Invalid Folder ID", "Please provide a valid folder ID.");
    }

    try {
        const response = await Folder.findByIdAndUpdate(req.params?.id, {
            sharedWith: req.body.allowUser
        }, {
            new: true
        })

        console.log(response);
        apiResponse(res, 200, "Updated SuccessFully!", response)
    } catch (error) {
        apiError(res, 500, "Something Went Wrong");
    }
}


const GetPublicFolders = async (req, res) => {
    try {
        const response = await Folder.find({ urlAccess: true });
        apiResponse(res, 200, "All Public Folders", response)
    } catch (error) {
        console.log(error)
    }
}


const GetSharedWithMe = async (req, res) => {
    try {
        const response = await Folder.find({ sharedWith: req.user.email });

        const arr = response.map((doc) => {
            const newdoc = doc.toObject()
            delete newdoc.urlAccess
            delete newdoc.sharedWith
            return newdoc
        })

        return apiResponse(res, 200, `Folders shared with ${req.user.email}`, arr)
    } catch (error) {
        apiError(res, 500, "Something went wrong")
        console.log(error);
    }
}

const GetFolderSharedWithME = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
        return apiError(res, 400, "Invalid Folder ID", "Please provide a valid folder ID.");
    }

    const response = await Folder.findById(req.params?.id);
    const sharedWith = response.sharedWith;
    const other = sharedWith.filter(arr => arr == req.user.email);

    if (other == []) {
        return apiError(res, 401, "You are not authorized for this action");
    } else {
        const obj = response.toObject();
        delete obj.sharedWith
        delete obj.urlAccess



        const notes = await Note.find({ folder: obj._id });
        const newNotes = notes.map(note => {
            let newObj = note.toObject();
            delete newObj.sharedWith
            delete newObj.urlAccess

            return newObj
        })

        return apiResponse(res, 200, "Folder Fetched SuccessFully!", {
            folderDetails: obj,
            Notes: newNotes
        });

    }
}

export { FolderCreate, ListFolders, GetFolder, renameFolder, DeleteFolder, ShareFolderToggle, GetPublicNote, updateShareStatus, GetPublicFolders, GetSharedWithMe, GetFolderSharedWithME }