import React, { useState } from "react";
import { User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Heading */}
                    <div className="flex items-center space-x-4">
                        <Link to={"/"} className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            NotesCollab
                        </Link>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to={"/public-assests"}
                            className="px-3 py-2 text-gray-600 hover:text-blue-600 transition-all 
                    border-b-2 border-transparent hover:border-blue-500 font-medium"
                        >
                            Public Assets
                        </Link>
                        <Link
                            to={"/form"}
                            className="px-3 py-2 text-gray-600 hover:text-blue-600 transition-all 
                    border-b-2 border-transparent hover:border-blue-500 font-medium"
                        >
                            Join Room
                        </Link>
                        <Link
                            to={"/createroom"}
                            className="px-3 py-2 text-gray-600 hover:text-blue-600 transition-all 
                    border-b-2 border-transparent hover:border-blue-500 font-medium"
                        >
                            Create Room
                        </Link>
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button className="flex items-center space-x-2 group">
                                <div className="p-1 rounded-full border-2 border-transparent group-hover:border-blue-100 transition-all">
                                    <User size={20} className="text-gray-600 group-hover:text-blue-600" />
                                </div>

                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            onClick={toggleDropdown}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Dropdown Menu (Mobile) */}
                {isOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col space-y-3 mt-4 border-t border-gray-100 pt-4">
                            <Link
                                to={"/public-assests"}
                                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-all 
                        border-l-4 border-transparent hover:border-blue-500 font-medium"
                            >
                                Public Assets
                            </Link>
                            <Link
                                to={"/form"}
                                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-all 
                        border-l-4 border-transparent hover:border-blue-500 font-medium"
                            >
                                Join a Room
                            </Link>
                            <Link
                                to={"/createroom"}
                                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-all 
                        border-l-4 border-transparent hover:border-blue-500 font-medium"
                            >
                                Create Room
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );

};

export default Navbar;