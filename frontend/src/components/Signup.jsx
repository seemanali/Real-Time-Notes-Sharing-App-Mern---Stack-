import { useState } from "react";
import { Upload, User, Mail, Lock, FileText, ArrowLeft, Contact } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
import Loading from "./Loading";
import { SuccessPopup } from "./Success";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        profileImage: null,
    });

    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImage: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        // console.log("Signing up with:", formData);

        setLoading(true)
        const response = await axios.post("http://localhost:8080/api/user/register", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        setLoading(false)
        if (!response.data.success) {
            setError(response.data.errorMessage)
        } else {
            //sucess message and loading
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false)
                navigate("/login")
            }, 3000);
        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-purple-300 p-6">
            {
                loading && (<Loading text={"Registering Your Account"} />)
            }
            {
                success && (<SuccessPopup message="Your Account has been register SuccessFully!" size="lg" />)
            }

            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">

                {/* Back to Home Button */}
                <Link to="/" className="absolute top-4 left-4 text-purple-600 hover:text-purple-800">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Sign Up</h2>

                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-4">
                    <label htmlFor="profile" className="cursor-pointer">
                        {preview ? (
                            <img src={preview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover mb-2" />
                        ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                <Upload className="text-gray-500 w-8 h-8" />
                            </div>
                        )}
                    </label>
                    <input type="file" accept="image/*" className="hidden" id="profile" onChange={handleImageChange} />
                    <label htmlFor="profile" className="text-sm text-purple-600 cursor-pointer">Upload Profile Picture</label>
                </div>

                <div className="text-red-600 text-center font-bold">{error}</div>

                {/* Form Fields */}
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>

                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-500" />
                        <textarea
                            name="bio"
                            placeholder="Bio (optional)"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 h-24"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Already have an account? */}
                <p className="text-center text-gray-600 mt-4">
                    Already have an account? <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
