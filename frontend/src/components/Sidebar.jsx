import React, { useEffect, useState } from "react";
import {
    FolderPlus,
    Folder,
    Share,
    Clock,
    User,
    Edit,
    Trash,
    Bell,
    Palette,
    Menu,
    X,
    PlusIcon,
    Share2
} from "lucide-react";
import PopupModal from "./PopupModal";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import constants from "../constants.js";
import Loading from "./Loading.jsx";
import { SuccessPopup } from "./Success.jsx";
import { ToastContainer, toast } from 'react-toastify'
import FolderSharePopup from "./FolderSharePopUp.jsx";

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("folder");
    const [modalAction, setModalAction] = useState("create");
    const [inputValueFromParent, setInputValueFromParent] = useState("");
    const [loading, SetLoading] = useState(false)

    const [folderState, setFolderState] = useState([]);
    const [Error, setError] = useState("");
    const [Success, setSuccess] = useState("");

    const [Extra, setExtra] = useState("");
    const [isSharing, setIsSharing] = useState(false)
    const [id, setid] = useState("")


    const token = useSelector((state) => state.reducers.token);

    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const fetchFolders = async () => {
        try {
            const response = await axios.get(`${constants.urlHost}/api/folder/list`, {
                headers: { authorization: `token ${token}` }
            });
            // console.log(response)
            if (response.data.success) {
                setFolderState(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch folders", error);
        }
    };

    const handleOpenModal = (type, action) => {
        setModalType(type);
        setModalAction(action);
        setIsModalOpen(true);
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);


    };

    async function actionHandler() {


        if (modalType === "folder" && modalAction === "create") {
            SetLoading(true)
            try {
                const response = await axios.post(
                    `${constants.urlHost}/api/folder/create/${inputValueFromParent}`,
                    {},
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Token ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setSuccess("Folder Created SuccessFully!");
                    fetchFolders();
                    setInputValueFromParent("");
                }
                // console.log(response)
            } catch (error) {
                // console.error("Folder creation failed", error);

                if (error.response) {
                    setError(error.response.data.errorMessage)
                } else {
                    setError(error.message)
                }

                // setTimeout(() => { setError("") }, 3000)
                setError("")

            } finally {
                SetLoading(false)
                // Success != "" && setTimeout(() => { setSuccess("") }, 3000)
            }

        }

        if (modalType === "folder" && modalAction === "rename") {
            SetLoading(true)
            try {
                const response = await axios.post(
                    `${constants.urlHost}/api/folder/rename/${Extra}/${inputValueFromParent}`,
                    {},
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Token ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    fetchFolders();
                    setInputValueFromParent("");
                }
                // console.log(response)
            } catch (error) {
                // console.error("Folder creation failed", error);

                if (error.response) {
                    toast.error(error.response.data.errorMessage)
                    // setError(error.response.data.errorMessage)
                } else {
                    toast.error(error.message)
                }


            } finally {
                SetLoading(false)
                // Error != "" && setTimeout(() => { setError("") }, 3000)
                // Success != "" && setTimeout(() => { setSuccess("") }, 3000)
            }
        }
    }

    useEffect(() => {
        if (!token) navigate("/login");
        else fetchFolders();
    }, [token]);

    const DeleteFolderHandler = async (id) => {
        try {
            let response = await axios.delete(`${constants.urlHost}/api/folder/delete/${id}`, {
                headers: {
                    authorization: `Token ${token}`
                }
            });

            navigate("/")
            fetchFolders();
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
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 right-4 z-50 p-2 bg-blue-500 text-white rounded-lg md:hidden shadow-lg hover:bg-blue-600 transition-all"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {
                isSharing && (<FolderSharePopup type={"folder"} id={id} onclose={setIsSharing} />)
            }

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-72 bg-white text-gray-800 p-6 space-y-6 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative shadow-lg`}
            >
                <button
                    onClick={() => handleOpenModal("folder", "create")}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-md"
                >
                    <FolderPlus size={18} />
                    <span>New Folder</span>
                </button>

                <div className="space-y-2 h-48 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-500">Folders</h3>
                    {folderState.map((folder, index) => (
                        <div

                            key={index}
                            className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                        >
                            <div
                                onClick={() => { navigate("/folder/" + folder._id) }}
                                className="flex items-center space-x-2">
                                <Folder size={16} className="text-blue-500" />
                                <span

                                >{folder.name}</span>
                            </div>
                            <div className="flex space-x-2">

                                <button

                                    onClick={() => {
                                        setExtra(folder._id)
                                        setInputValueFromParent(folder.name);
                                        handleOpenModal("folder", "rename")
                                    }}
                                    className="text-gray-500 hover:text-blue-500">
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => {
                                        setid(folder._id)
                                        setIsSharing(true)
                                    }}
                                    className="text-gray-500 hover:text-blue-500">
                                    <Share2 size={16} />
                                </button>
                                <button
                                    onClick={() => DeleteFolderHandler(folder._id)}
                                    className="text-gray-500 hover:text-red-500">
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500">Shared with Me</h3>
                    <div
                        onClick={() => {
                            navigate("/shared-with-me")
                        }}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">

                        <Share size={16} className="text-blue-500" />
                        <span>Shared Assets</span>
                    </div>
                </div>



                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500">Settings</h3>
                    <Link to={"/profile"} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                        <User size={16} className="text-blue-500" />
                        <span>Profile</span>
                    </Link >
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                        <Bell size={16} className="text-blue-500" />
                        <span>Notifications</span>
                    </div>
                    {/* <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                        <Palette size={16} className="text-blue-500" />
                        <span>Theme</span>
                    </div> */}
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
            {
                loading && (<Loading />)
            }
            <ToastContainer />

        </>
    );
};

export default Sidebar;