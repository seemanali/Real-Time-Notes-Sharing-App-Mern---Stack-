import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Copy } from "lucide-react";
import constants from "../constants";

const PublicNoteDetail = () => {
    const { id } = useParams(); // Get note ID from the URL
    const [note, setNote] = useState(null);

    // Fetch Note Details
    const loadNoteDetails = async () => {
        try {
            const response = await axios.get(`${constants.urlHost}/api/note/public/${id}`);
            setNote(response.data.data);
        } catch (error) {
            console.error("Error fetching note:", error.response);
        }
    };

    useEffect(() => {
        loadNoteDetails();
    }, [id]);

    // Handle Copy Link to Clipboard
    const handleCopyLink = () => {
        const url = `${window.location.origin}/public-notes/${id}`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div className="p-6 w-full max-w-5xl mx-auto bg-white">
            <h1 className="text-center font-extrabold text-4xl">Public Note</h1>
            {/* Note Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-blue-600">{note?.title || "Untitled Note"}</h2>
                <button
                    onClick={handleCopyLink}
                    className="text-gray-400 hover:text-blue-500"
                    title="Copy Link"
                >
                    <Copy size={20} />
                </button>
            </div>

            {/* Note Content */}
            <div className="prose max-w-full">
                <p>{note?.content || "No content available."}</p>
            </div>
        </div>
    );
};

export default PublicNoteDetail;

