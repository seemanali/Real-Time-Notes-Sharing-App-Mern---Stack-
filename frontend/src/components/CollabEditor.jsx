import { Editor } from '@tinymce/tinymce-react';
import { DoorOpen, User, Hash, Key, Square, AlertCircle, Users, Mic, MicOff, Video, VideoOff, MoreVertical } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import parse from "html-react-parser";
import axios from 'axios';
import constants from '../constants';

const CollaborativeEditor = () => {
    const [content, setContent] = useState("");
    const [roomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isReadOnly, setReadOnly] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState("");
    const [members, setMembers] = useState([
    ]);
    const [mymail, setMymail] = useState("")

    const navigate = useNavigate();
    const socket = useRef(null);
    const roomToken = useSelector(st => st.reducers.roomToken);
    const token = useSelector(st => st.reducers.token);

    // Socket connection and event handlers
    useEffect(() => {
        if (!roomToken) navigate("/form");

        socket.current = io("http://localhost:8080", {
            auth: {
                token: roomToken,
                userDataToken: token
            }
        });

        const socketInstance = socket.current;

        socketInstance.on("connect_error", () => navigate("/form"));
        socketInstance.on("connect", () => {
            console.log("Connected to server");
            socketInstance.emit("joinRoom", roomToken);
        });

        socketInstance.on("reciveNote", setContent);
        socketInstance.on("endRoom", () => {
            socketInstance.disconnect();
            navigate("/");
        });

        socketInstance.on("roomData", (payload) => {
            setUserName(payload.MyName);
            setRoomId(payload.roomId);
            setRoomName(payload.roomName);
            setMymail(payload.yourMail)
            const amIOwner = payload.ownerMail === payload.yourMail;
            setIsOwner(amIOwner);
            setReadOnly(!amIOwner);
            if (amIOwner) setPassword(payload.password);
        });


        socketInstance.on("members", (payload) => {
            console.log(payload);
            const uniqueArr = payload.filter(
                (obj, index, self) =>
                    index === self.findIndex((o) => o.email === obj.email)
            );

            console.log("unique : ", uniqueArr);

            setMembers(uniqueArr)

        });



        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (content && socket.current) {
            socket.current.emit("note", content);
        }
    }, [content]);

    socket.current && socket.current.on("forceRemove", (payload) => {
        console.log(payload, userName)
        if (mymail == payload) {
            socket.current.disconnect();
            navigate("/")
        }
    })

    const handleEditorChange = (newContent) => {
        setContent(newContent);
    };

    const leaveRoom = () => {
        socket.current?.disconnect();
        navigate("/form");
    };


    const handleRemoveMember = (email) => {
        console.log("inside ", email)
        socket.current.emit("removeMember", email)
    }

    const endRoom = async () => {
        try {
            await axios.delete(`${constants.urlHost}/api/liveroom/delete/${roomId}`, {
                headers: { "authorization": `Token ${token}` }
            });
            socket.current?.emit("endRoom", "Room ended by owner");
            toast.success("Room ended successfully");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.errorMessage || err.message);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <ToastContainer position="top-center" autoClose={3000} />

            {/* Header */}
            <header className="bg-white shadow-sm p-3">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-semibold text-gray-800 truncate flex items-center">
                            <DoorOpen className="h-5 w-5 mr-2 text-blue-600" />
                            {roomName || "Collaboration Room"}
                        </h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                                <Hash className="h-4 w-4 mr-1" /> {roomId}
                            </span>
                            {password && (
                                <span className="flex items-center">
                                    <Key className="h-4 w-4 mr-1" /> {password}
                                </span>
                            )}
                            <span className="flex items-center">
                                <User className="h-4 w-4 mr-1" /> {userName}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={leaveRoom}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center text-sm transition-colors"
                        >
                            <DoorOpen className="h-4 w-4 mr-1" />
                            Leave
                        </button>
                        {isOwner && (
                            <button
                                onClick={endRoom}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center text-sm transition-colors"
                            >
                                <Square className="h-4 w-4 mr-1" />
                                End Room
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
                {/* Editor Area */}
                <section className={`flex-1 ${isReadOnly ? 'overflow-y-auto' : ''} p-4 border-b lg:border-b-0 lg:border-r`}>
                    {isReadOnly ? (
                        <div className="h-full flex flex-col">
                            <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
                                View Only Mode
                            </h2>
                            <div className="prose max-w-none flex-1 overflow-auto">
                                {parse(content)}
                            </div>
                        </div>
                    ) : (
                        <Editor
                            value={content}
                            onEditorChange={handleEditorChange}
                            apiKey="2w55lps83a4h3uix1sm1lyo0um113u0t7kzhfvlpcz8s5fch"
                            init={{
                                height: '100%',
                                menubar: false,
                                plugins: 'autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                                toolbar: 'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                        />
                    )}
                </section>

                {/* Members Sidebar */}
                <aside className="w-full lg:w-72 xl:w-80 bg-gray-50 border-t lg:border-t-0 flex flex-col">
                    <div className="p-3 border-b flex items-center">
                        <Users className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="font-medium">Participants ({members.length})</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {members.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 bg-white rounded-md shadow-xs hover:bg-gray-100 transition-colors">
                                <div className="flex items-center min-w-0">
                                    <div className={`relative flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center mr-3 text-sm font-medium
                        ${member.isYou ? 'bg-blue-100 text-blue-800' :
                                            member.isOwner ? 'bg-purple-100 text-purple-800' : 'bg-gray-200 text-gray-700'}`}>
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {member.name}
                                            {member.isYou && <span className="ml-1 text-blue-600">(You)</span>}
                                        </p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            {member.isOwner && (
                                                <span className="inline-flex items-center mr-2">
                                                    <Key className="h-3 w-3 mr-1 text-purple-500" /> Owner
                                                </span>
                                            )}

                                            <span className="inline-flex items-center">

                                                <span className="text-green-600">{member.role}</span>



                                            </span>

                                        </div>
                                    </div>
                                </div>

                                {(isOwner && member.role != "owner") && (
                                    <button
                                        onClick={() => handleRemoveMember(member.email)}
                                        className="p-1 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                                        aria-label="Remove member"
                                        title="Remove member"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default CollaborativeEditor;