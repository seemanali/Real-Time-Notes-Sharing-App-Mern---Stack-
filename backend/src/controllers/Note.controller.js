import { apiError, apiResponse } from "../Utlis/ApiResponse.js";
import Folder from "../models/Folder.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

import Note from "../models/Note.model.js"

const CreateNote = async (req, res) => {

    const { title, content } = req.body;
    console.log(title, content)
    if (!title || !content) return apiError(res, 400, "Title and content is required", `Make sure you send "title" and  "content" in form-data's body `);


    if (!mongoose.Types.ObjectId.isValid(req.params.folderId)) {
        return apiError(res, 400, "Something went wrong", "Folder id in the URL params is invalid. Make sure you pass the valid to create a note within the folder!");
    }

    const FolderExists = await Folder.findById(req.params.folderId);
    if (!FolderExists) {
        return apiError(res, 400, "Something went wrong", "Folder Id provided;   not founded!");
    }


    try {
        const NoteResponse = await Note.create({
            title: title || "No Title",
            content: content || "No Content",
            owner: req.user._id,
            folder: req.params.folderId

        });

        if (NoteResponse) {
            apiResponse(res, 200, "Note Created SuccessFully!", NoteResponse);
        }
    } catch (error) {
        console.log(error)
        return apiError(res, 400, error._message)
    }
}







const GetNote = async (req, res) => {
    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return apiError(res, 400, "Something went Wrong", "Provided id is Invalid. Make sure you send the authentic one!")
    }

    const NoteResponse = await Note.findById(noteId).populate("owner").populate("folder");
    if (!NoteResponse) {
        return apiResponse(res, 200, "No Note with such Id is found", null, "Make sure you send the valid Id. The given id does not refer to any note. Thank You");
    } else {
        const newObj = NoteResponse.toObject();
        if (newObj.owner.email != req.user.email) {
            return apiError(res, 400, "Something Went Wrong", "The current User is not allowed to perform this action");
        } else {

            return apiResponse(res, 200, "Note Fetched SuccessFully", NoteResponse);
        }

    }
}

const DeleteNote = async (req, res) => {
    console.log("delete note :", req.user)


    try {
        const delNote_response = await Note.findById(req.params.id).populate("owner");

        // Check if the note exists
        if (!delNote_response) {
            return apiError(res, 400, "Note not found", "No note exists with the given ID.");
        }

        // Check if the logged-in user is the owner
        console.log(delNote_response.owner.email, req.user.email)
        if (delNote_response.owner.email != req.user.email) {
            return apiError(res, 401, "Unauthorized Access", "You are not allowed to delete this note.");
        }

        // Convert document to plain object
        const delNote_responseObj = delNote_response.toObject();

        // Remove the owner field from response
        delete delNote_responseObj.owner;

        // Now, delete the note
        await Note.findByIdAndDelete(req.params.id);

        return apiResponse(res, 200, "Note Deleted Successfully!", delNote_responseObj);
    } catch (error) {
        console.error(error);
        return apiError(res, 500, "Something Went Wrong. Please try again later.");
    }
};



const UpdateNote = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return apiError(res, 400, "Invalid Document ID", "The provided document ID is not valid.");
        }

        // Fetch the note to check ownership BEFORE updating
        const existingNote = await Note.findById(req.params.id).populate("owner");

        // If note not found
        if (!existingNote) {
            return apiError(res, 400, "Note Not Found", "No note exists with the given ID.");
        }

        // Check if the logged-in user is the owner
        if (existingNote.owner.email !== req.user.email) {
            return apiError(res, 401, "Unauthorized Access", "You are not allowed to update this note.");
        }

        // Filter out only allowed fields (title, content)
        const allowedFields = ["title", "content"];
        const filteredData = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                filteredData[key] = req.body[key];
            }
        });

        // Perform the update
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: filteredData },
            { new: true, runValidators: true }
        );

        // Convert document to plain object and remove owner info
        const responseObj = updatedNote.toObject();
        delete responseObj.owner;

        return apiResponse(res, 200, "Note Updated Successfully!", responseObj);
    } catch (error) {
        console.error(error);
        return apiError(res, 500, "Something Went Wrong. Please try again later.");
    }
};


const TogglePublic = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return apiError(res, 400, "Invalid Document ID", "The provided document ID is not valid.");
        }

        // Fetch the note first to check ownership
        const existingNote = await Note.findById(req.params.id).populate("owner");

        // If note not found
        if (!existingNote) {
            return apiError(res, 400, "Note Not Found", "No note exists with the given ID.");
        }

        // Check if the logged-in user is the owner
        if (existingNote.owner.email !== req.user.email) {
            return apiError(res, 401, "Unauthorized Access", "You are not allowed to modify this note.");
        }

        // Toggle 'urlAccess' field using aggregation pipeline
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            [{ $set: { urlAccess: { $not: "$urlAccess" } } }],
            { new: true, runValidators: true }
        );

        return apiResponse(res, 200, "Note shareability toggled!", updatedNote, `Note shareability via link: ${updatedNote.urlAccess}`);
    } catch (error) {
        console.error("Error in toggling note:", error);
        return apiError(res, 500, "Something Went Wrong. Please try again later.");
    }
};

const GetPublicNote = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
        return apiError(res, 400, "Invalid Folder ID", "Please provide a valid folder ID.");
    }

    try {
        const response = await Note.findById(req.params?.id);
        if (!response) {
            return apiError(res, 400, "The document with requested Id is not found", "The document with requested Id is not found");
        }

        if (!response.urlAccess) {
            return apiError(res, 401, "UnAuthorized Access", "This document is not publiclly available. Ask the owner to make it public.");
        }

        const Obj = response.toObject();
        delete Obj.folder
        delete Obj.owner


            
        return apiResponse(res, 200, "Public folder Fetched SuccessFully", Obj);



    } catch (error) {
        console.error("Error in Geting public Note:", error);
        return apiError(res, 500, "Something Went Wrong. Please try again later.");
    }
}

const GetPublicNotes = async (req, res) => {
    try {
        const response = await Note.find({ urlAccess: true });
        console.log(response);
        apiResponse(res, 200, "All Public Notes", response)
    } catch (error) {
        console.log(error)
    }
}


const updateShareStatus = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
        return apiError(res, 400, "Invalid Folder ID", "Please provide a valid folder ID.");
    }

    try {
        const response = await Note.findByIdAndUpdate(req.params?.id, {
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


export { CreateNote, GetNote, DeleteNote, UpdateNote, TogglePublic, GetPublicNote, updateShareStatus, GetPublicNotes };