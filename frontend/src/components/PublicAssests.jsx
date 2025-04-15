import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
    Folder,
    StickyNote,
    Copy,
    Search,
    Menu,
    ChevronDown,
} from "lucide-react";
import axios from "axios";
import constants from "../constants";
import { useLocation, useNavigate } from "react-router-dom";

const PublicAssests = () => {
    const [folders, setFolders] = useState([]);

    const [notes, setNotes] = useState([]);
    const navigate = useNavigate()
    const location = useLocation();


    const token = useSelector(state => state.reducers.token)
    // console.log(token)


    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const copyLink = (noteId) => {
        const link = `${window.location.origin}/public-notes/${noteId}`;
        navigator.clipboard.writeText(link);
        alert("Link copied!");
    };

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );


    async function loadPublicNotes() {
        try {
            const response = await axios.get(`${constants.urlHost}/api/note/publicnotes`);
            setNotes(response.data.data)
        } catch (error) {
            console.log(error.response);
        }
    }

    async function loadPublicFolders() {
        try {
            const response = await axios.get(`${constants.urlHost}/api/folder/publicfolders`);
            // console.log(response)
            setFolders(response.data.data)
            // console.log(response.data)
        } catch (error) {
            console.log(error.response);
        }
    }

    async function loadSharedwithMe() {
        try {
            const response = await axios.get(`${constants.urlHost}/api/folder/sharedwithme`, {
                headers: {
                    "authorization": `Token ${token}`
                }
            });

            setFolders(response.data.data)
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        // console.log(location.pathname)
        if (location.pathname == "/public-assests") {
            loadPublicNotes()
            loadPublicFolders()
        } else {
            loadSharedwithMe()
        }

    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white text-black">
            {/* Mobile Dropdown for Folders */}
            <div className="md:hidden p-4 border-b border-black-300 bg-white flex items-center justify-between shadow-sm">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-lg font-semibold text-gray-800"
                >
                    <Menu className="w-5 h-5" />
                    <span>Folders</span>
                    <ChevronDown
                        className={`w-4 h-4 transform transition-transform duration-200 ${showDropdown ? "rotate-180" : ""
                            }`}
                    />
                </button>
            </div>

            {showDropdown && (
                <div className="md:hidden bg-white border border-t-0 border-black-300 rounded-b-md shadow-md mx-4 mt-[-1px]">
                    {folders.map((folder, index) => (
                        <div
                            key={index}
                            onClick={() => {

                                if (location.pathname == "/shared-with-me") {
                                    navigate("/shared-with-me/folder/" + folder._id)
                                } else {
                                    navigate("/public-folders/" + folder._id)
                                }
                            }}
                            className="flex items-center justify-between px-4 py-2 border-b border-black-600 hover:bg-blue-50 cursor-pointer transition"
                        >
                            <div className="flex items-center space-x-2 text-gray-800">
                                <Folder size={16} className="text-blue-500" />
                                <span>{folder.name}</span>
                            </div>
                            <Copy className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                        </div>
                    ))}
                </div>
            )}

            <aside className="hidden md:flex md:w-64 flex-col p-4 border-r bg-gray-50 space-y-2">
                <h2 className="text-xl font-semibold mb-2">Folders</h2>
                {folders.map((folder, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            if (location.pathname == "/shared-with-me") {
                                navigate("/shared-with-me/folder/" + folder._id)
                            } else {
                                navigate("/public-folders/" + folder._id)
                            }
                        }}
                        className="flex items-center space-x-2 cursor-pointer mt-2
                        
                        hover:text-blue-600"
                    >
                        <Folder size={16} />
                        <span>{folder.name}</span>
                    </div>
                ))}
            </aside>

            {/* Notes Feed */}
            <main className="flex-1 p-4">
                {/* Search */}
                <div className="flex items-center mb-4 border rounded-lg px-3 py-2 shadow-sm">
                    <Search className="w-4 h-4 mr-2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none"
                    />
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((note, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <StickyNote size={18} className="text-purple-600" />
                                    <h3 className="text-md font-semibold">{note.title}</h3>
                                </div>
                                <button
                                    onClick={() => copyLink(note._id)}
                                    className="text-gray-500 hover:text-blue-600"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-700">{note.content}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PublicAssests;
