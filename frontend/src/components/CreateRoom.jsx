import axios from 'axios';
import { DoorOpen, X, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import constants from '../constants';
import { storeRoomData } from "../store/reducers.js"

const CreateRoom = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(""); // Replace with your actual error state
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [room, setRoom] = useState("");




    const token = useSelector(state => state.reducers.token);
    const handleCreateRoom = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await axios.post(`${constants.urlHost}/api/liveroom/create`,
                {
                    "roomName": room
                }, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Token ${token}`
                }
            }
            )

            const { roomId, password } = response.data.data
            console.log(roomId, password);

            const validate = await axios.post(`${constants.urlHost}/api/liveroom/validate`,
                {
                    id: roomId, password
                }, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Token ${token}`

                }
            });

            dispatch(storeRoomData(validate.data.data.token))
            setIsLoading(false);
            navigate("/collab");

        } catch (error) {
            if (error.response) {
                console.log(error.response.data.errorMessage)
                setError(error.response.data.errorMessage);
            } else {
                setError(error.message)
            }
        }




    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                {/* Error Display Section */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </div>
                    </div>
                )}

                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                    <DoorOpen className="h-6 w-6 mr-2 text-blue-500" />
                    Create New Room
                </h1>

                {/* Room Name Field */}
                <div className="mb-6">
                    <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
                        Room Name
                    </label>
                    <div className="relative">
                        <input
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            type="text"
                            id="roomName"
                            disabled={isLoading}
                            className={`block w-full px-4 py-2 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            placeholder="Enter a room name"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate("/")}
                        disabled={isLoading}
                        className="flex-1 cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="h-5 w-5 mr-2" />
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateRoom}
                        disabled={isLoading}
                        className="flex-1 flex items-center cursor-pointer justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <DoorOpen className="h-5 w-5 mr-2" />
                                Create Room
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateRoom;