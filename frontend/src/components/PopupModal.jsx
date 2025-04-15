import React, { useEffect, useState } from "react";

const PopupModal = ({ type, action, onClose, onSubmit, inputValueGiven, setInputValueGiven }) => {
    const [inputValue, setInputValue] = useState(inputValueGiven || "");
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        setDisable(inputValueGiven.trim() === "");
    }, [inputValueGiven]);





    const handleSubmit = () => {
        onSubmit()
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {action} {type}
                </h2>
                <input
                    type="text"
                    value={inputValueGiven}
                    onChange={(e) => setInputValueGiven(e.target.value)}
                    placeholder={`Enter ${type} name`}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={disable}
                        onClick={handleSubmit}
                        className={`px-4 py-2 text-white rounded-lg transition-all ${disable ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                        {action}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupModal;