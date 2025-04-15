import { Hash, Key, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import constants from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { storeRoomData } from "../store/reducers.js"

const RoomConnectionForm = () => {
    const [roomId, setRoomId] = useState("");
    const [password, setPassword] = useState("");


    const [error, setError] = useState("");
    const dispatch = useDispatch();




    const token = useSelector(state => state.reducers.token);

    const handleSubmit = async () => {

        console.table(roomId, password)
        try {
            const response = await axios.post(`${constants.urlHost}/api/liveroom/validate`,
                {
                    id: roomId, password
                }, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Token ${token}`

                }
            }
            );



            dispatch(storeRoomData(response.data.data.token))
            navigate("/collab");
        } catch (error) {
            if (error.response) {
                setError(error.response.data.errorMessage)
                // console.log(error.response)
            } else { setError(error.message) }
        }
    }
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                {error != "" && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </div>
                    </div>
                )}
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Join a Room
                </h1>

                {/* Room ID Field */}
                <div className="mb-4">
                    <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                        Room ID
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            onChange={(e) => {
                                setError("")
                                setRoomId(e.target.value)
                            }}
                            type="text"
                            id="roomId"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Room ID"
                        />
                    </div>
                </div>

                {/* Room Password Field */}
                <div className="mb-6">
                    <label htmlFor="roomPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Room Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Key className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            onChange={(e) => {
                                setError("")
                                setPassword(e.target.value)
                            }}
                            type="password"
                            id="roomPassword"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Password"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    {/* Cancel Button (Secondary Action) */}

                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 flex items-center justify-center cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        <X className="h-5 w-5 mr-2" />
                        Cancel
                    </button>

                    {/* Connect Button (Primary Action) */}
                    <button
                        onClick={handleSubmit}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <ArrowRight className="h-5 w-5 mr-2" />
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomConnectionForm;