import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FileText, Copy } from "lucide-react";
import constants from "../constants";
import { useSelector } from "react-redux";

const PublicFolderDetail = () => {
    const { id } = useParams(); // Get folder ID from the URL
    const [folder, setFolder] = useState(null);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();


    const token = useSelector(state => state.reducers.token)

    // Fetch Folder Details

    const location = useLocation();



    const loadFolderDetails = async () => {
        try {
            const folderResponse = await axios.get(`${constants.urlHost}/api/folder/public/${id}`);
            // console.log(folderResponse)
            setFolder(folderResponse.data.data.folderDetails.name);
            setNotes(folderResponse.data.data.Notes)
        } catch (error) {
            console.error("Error fetching folder", error.response);
        }
    };

    // Fetch Notes in the Folder
    const loadSharedwithMeFolder = async () => {
        try {
            const folderResponse = await axios.get(`${constants.urlHost}/api/folder//sharedwithme/folder/${id}`, {
                headers: {
                    "authorization": `Token ${token}`
                }
            });
            // console.log(folderResponse)
            setFolder(folderResponse.data.data.folderDetails.name);
            setNotes(folderResponse.data.data.Notes)
        } catch (error) {
            console.error("Error fetching folder", error.response);
        }
    }


    useEffect(() => {
        const locationName = location.pathname.split("/");
        console.log(locationName[1])
        if (locationName[1] == "public-folders") {
            loadFolderDetails();
        } else {
            loadSharedwithMeFolder()
        }


    }, [id, location.pathname]);

    // Handle Copy Link to Clipboard
    const handleCopyLink = (noteId) => {
        const url = `${window.location.origin}/public-notes/${noteId}`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div className="p-6 w-full max-w-5xl mx-auto bg-white">
            <h1 className="text-center font-extrabold text-4xl">{
                location.pathname.split("/")[1]
            } </h1>
            {/* Folder Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" />
                    <h2 className="text-xl font-semibold">{folder || "Untitled Folder"}</h2>
                </div>
            </div>

            {/* Notes List */}
            <div className="grid gap-4 sm:grid-cols-2">
                {notes && notes.length > 0 ? (
                    notes.map((note, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
                        >
                            <div
                                className="cursor-pointer"

                            >
                                <h3 className="text-lg font-medium text-blue-700 truncate">
                                    {note.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {note.content || "No description"}
                                </p>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No notes in this folder.</p>
                )}
            </div>
        </div >
    );
};

export default PublicFolderDetail;
