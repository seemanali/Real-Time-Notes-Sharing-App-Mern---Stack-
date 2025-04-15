import React, { useEffect, useState, useRef } from "react";
import { Pen, Plus, Trash, User, ArrowDown, Save, Share, Download, Share2 } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify'
import axios from "axios";
import constants from "../constants";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PopupModal from "./PopupModal";
import Loading from "./Loading";
import FolderSharePopup from "./FolderSharePopUp.jsx";

const OpenFolder = () => {
    const [folderName, setFolderName] = useState("My Folder");
    const [notes, setNotes] = useState([]);
    const [isEditingFolderName, setIsEditingFolderName] = useState(false);
    const [loading, SetLoading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [Id, setid] = useState("")

    const headingRefs = useRef([]);
    const paraRefs = useRef([]);

    const handleSend = async (id, index) => {
        const title = headingRefs.current[index]?.innerText;
        const content = paraRefs.current[index]?.innerText;

        try {
            SetLoading(true)
            const response = await axios.put(`${constants.urlHost}/api/note/update/${id}`,
                { title, content },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Token ${token}`
                    }
                }
            )

            SetLoading(false);
            fetchNotes()
        } catch (error) {
            SetLoading(false);
            if (error.response) {
                toast.error(error.response.data.errorMessage)
                // setError(error.response.data.errorMessage)
            } else {
                toast.error(error.message)
            }
        }




    };


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("folder");
    const [modalAction, setModalAction] = useState("create");
    const [inputValueFromParent, setInputValueFromParent] = useState("");

    const { id } = useParams();
    const token = useSelector((state) => state.reducers.token);
    const navigate = useNavigate()

    const handleOpenModal = (type, action) => {
        setModalType(type);
        setModalAction(action);
        setIsModalOpen(true);
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);


    };


    const handleRenameFolder = () => {
        const newName = prompt("Enter new folder name:", folderName);
        if (newName) {
            setFolderName(newName);
        }
    };

    const handleAddNote = async () => {
        SetLoading(true)
        try {
            let response = await axios.post(`${constants.urlHost}/api/note/create/${id}`, {
                "title": "New Note",
                "content": "Edit your note and click save button."
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": "Token " + token
                    }
                }
            )
            SetLoading(false)

            fetchNotes();
        } catch (error) {
            SetLoading(false)
            if (error.response) {
                toast.error(error.response.data.errorMessage)
                // setError(error.response.data.errorMessage)
            } else {
                toast.error(error.message)
            }
        }

    };

    const handleDeleteNote = async (id) => {
        SetLoading(true)
        try {
            const respons = await axios.delete(`${constants.urlHost}/api/note/delete/${id}`,
                {
                    headers: {
                        authorization: `Token ${token}`
                    }
                }
            )
            SetLoading(false)
            fetchNotes()
        } catch (error) {
            SetLoading(false)
            if (error.response) {
                toast.error(error.response.data.errorMessage)
                // setError(error.response.data.errorMessage)
            } else {
                toast.error(error.message)
            }
        }
    };

    const handleShareNote = (id) => {
        alert(`Sharing note with ID: ${id}`);
    };

    const handleDownloadNote = (id) => {
        alert(`Downloading note with ID: ${id}`);
    };

    const handleSaveNote = (id) => {
        alert(`Saving note with ID: ${id}`);
    };



    async function fetchNotes() {
        try {
            let response = await axios.get(`${constants.urlHost}/api/folder/get/${id}`,
                {
                    headers: { authorization: `token ${token}` }
                }
            );
            setFolderName(response.data.data.folder.name)
            setNotes(response.data.data.notes)

            // console.log(response)
        } catch (error) {
            // if (error.response) {
            //     toast.error(error.response.data.errorMessage)
            // } else {
            //     toast.error(error.message)
            // }
            navigate("/")
        }
    }

    useEffect(() => {
        fetchNotes();
    }, [id]);


    async function actionHandler() {


        if (modalType === "folder" && modalAction === "rename") {
            // SetLoading(true)
            try {
                const response = await axios.post(
                    `${constants.urlHost}/api/folder/rename/${id}/${inputValueFromParent}`,
                    {},
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Token ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    fetchNotes()
                    setInputValueFromParent("");
                }
                // console.log(response)
            } catch (error) {

                if (error.response) {
                    toast.error(error.response.data.errorMessage)
                    // setError(error.response.data.errorMessage)
                } else {
                    toast.error(error.message)
                }
            }
        }
    }



    const DeleteFolderHandler = async () => {
        try {
            let response = await axios.delete(`${constants.urlHost}/api/folder/delete/${id}`, {
                headers: {
                    authorization: `Token ${token}`
                }
            });

            navigate("/")

        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.errorMessage)
                // setError(error.response.data.errorMessage)
            } else {
                toast.error(error.message)
            }
        }

    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <ToastContainer />
            {
                loading && <Loading />
            }
            {
                isSharing && (<FolderSharePopup type={"note"} id={Id} onclose={setIsSharing} />)
            }
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
                {/* 1️⃣ Top Section (Header) */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        {isEditingFolderName ? (
                            <input
                                type="text"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                onBlur={() => setIsEditingFolderName(false)}
                                className="text-xl font-bold border-b-2 border-blue-500 focus:outline-none"
                            />
                        ) : (
                            <h1 className="text-xl font-bold">{folderName}</h1>
                        )}
                        <button onClick={() => {
                            setInputValueFromParent(folderName)
                            handleOpenModal("folder", "rename")
                        }} className="text-gray-500 hover:text-blue-500">
                            <Pen size={20} />
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleAddNote} className="text-gray-500 hover:text-blue-500">
                            <Plus size={20} />
                        </button>
                        {/* <button
                            onClick={DeleteFolderHandler}
                            className="text-gray-500 hover:text-blue-500">
                            <Trash size={20} />
                        </button> */}
                        <button className="text-gray-500 hover:text-blue-500">
                            <Share2 size={20} />
                        </button>
                        <button className="text-gray-500 hover:text-blue-500">
                            <ArrowDown size={20} />
                        </button>
                    </div>
                </div>

                {/* 2️⃣ Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        notes.length == 0 && <h2 className="text-lg font-medium mb-2">No Notes found</h2>
                    }

                    {notes.map((note, index) => (
                        <div key={note._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-2" contentEditable={true}

                                ref={(el) => (headingRefs.current[index] = el)}
                                suppressContentEditableWarning={true}
                            >{note.title}</h2>
                            <p className="text-sm text-gray-600 mb-4 text-wrap break-words"

                                contentEditable={true}
                                ref={(el) => (paraRefs.current[index] = el)}
                                suppressContentEditableWarning={true}
                            >{note.content}</p>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => handleSend(note._id, index)} className="text-gray-500 hover:text-blue-500">
                                    <Save size={16} />
                                </button>
                                <button onClick={() => {
                                    setid(note._id)
                                    setIsSharing(true)
                                }} className="text-gray-500 hover:text-blue-500">
                                    <Share size={16} />
                                </button>
                                <button onClick={() => handleDownloadNote(note._id)} className="text-gray-500 hover:text-blue-500">
                                    <Download size={16} />
                                </button>
                                <button onClick={() => handleDeleteNote(note._id)} className="text-gray-500 hover:text-red-500">
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <PopupModal
                    type={modalType}
                    action={modalAction}
                    onClose={handleCloseModal}
                    onSubmit={actionHandler}
                    inputValueGiven={inputValueFromParent}
                    setInputValueGiven={setInputValueFromParent}
                />
            )}
        </div>
    );
};

export default OpenFolder;