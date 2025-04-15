import { useEffect, useState } from "react";
import { X, Plus, Trash2, Globe, Lock, Loader } from "lucide-react";
import axios from "axios";
import constants from "../constants";
import { useSelector } from "react-redux";

const FolderSharePopup = ({ type, id, onclose }) => {

    const [isPublic, setIsPublic] = useState(false);
    const [emails, setEmails] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [name, setName] = useState("");

    const [Loading, setLoading] = useState(false);

    const handleAddEmail = () => {
        if (newEmail.trim() !== "") {
            setEmails([...emails, newEmail.trim()]);
            setNewEmail("");
        }
    };

    const handleDeleteEmail = (index) => {
        setEmails(emails.filter((_, i) => i !== index));
    };

    const token = useSelector(state => state.reducers.token)

    async function fetchData() {

        try {
            let response = await axios.get(`${constants.urlHost}/api/${type}/get/${id}`, {
                headers: {
                    authorization: `Token ${token}`
                }
            });

            if (type == "folder") {
                setName(response.data.data.folder.name)
                setEmails(response.data.data.folder.sharedWith)
                setIsPublic(response.data.data.folder.urlAccess)
            } else {
                setName(response.data.data.title)
                setEmails(response.data.data.sharedWith)
                setIsPublic(response.data.data.urlAccess)
            }


        } catch (error) {
            console.log(error.response);
            onclose(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [type, id])

    async function handlePublicToggle() {
        setLoading(true)
        try {
            const response = await axios.put(`${constants.urlHost}/api/${type}/allow/public/${id}`, {}, {
                headers: {
                    "authorization": `Token ${token}`
                }
            })
            fetchData()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error.response)
        }
    }

    async function handleArraySave() {
        setLoading(true)
        try {
            const response = await axios.put(`${constants.urlHost}/api/${type}/sharewith/${id}`,
                { 'allowUser': emails },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Token ${token}`
                    }
                }
            )
            fetchData()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error.response)
        }
    }

    if (Loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl shadow-xl  w-full max-w-md p-32 relative space-y-4 flex items-center justify-center">
                    <Loader size={78} className="animate-spin" />
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative space-y-4">
                {/* Close button */}
                <button
                    onClick={() => {
                        onclose(false)
                    }}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-gray-800">Share {type} {" "} {name}</h2>

                {/* Toggle */}
                <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-2">
                        {isPublic ? (
                            <Globe size={18} className="text-blue-600" />
                        ) : (
                            <Lock size={18} className="text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                            {isPublic ? "Publicly Available" : "Private Access"}
                        </span>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isPublic}
                            onChange={handlePublicToggle}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 relative transition">
                            <div
                                className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform transform peer-checked:translate-x-full"
                            />
                        </div>
                    </label>
                </div>

                {/* Email list */}
                <div className="space-y-3">
                    {emails.map((email, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2"
                        >
                            <span className="text-sm text-gray-700 break-all">{email}</span>
                            <button
                                onClick={() => handleDeleteEmail(index)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add new email */}
                <div className="flex items-center space-x-2">
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1 p-2 border rounded-lg text-sm outline-none"
                    />
                    <button
                        onClick={handleAddEmail}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Save or Close */}
                <div className="flex justify-end space-x-2 pt-2">
                    <button
                        onClick={() => {
                            onclose(false)
                        }}
                        className="px-4 py-1.5 text-sm rounded-lg border text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleArraySave}
                        className="px-4 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FolderSharePopup;
