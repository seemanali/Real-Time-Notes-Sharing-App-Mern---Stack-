import axios from "axios";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import constants from "../constants";
import Loading from "./Loading";
import { SuccessPopup } from "./Success";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducers.js"

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("");

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false)

    const dispatch = useDispatch();

    async function formSubmit(e) {
        const formData = { email, password };
        // console.log(formData)
        e.preventDefault();

        setLoading(true)
        const response = await axios.post(`${constants.urlHost}/api/user/login`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        );
        setLoading(false)
        if (!response.data.success) {
            setError(response.data.errorMessage)
        } else {
            //sucess message and loading
            const tokenParent = response.data.data;
            dispatch(setUser({ token: tokenParent.token }))
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false)
                navigate("/")
            }, 3000);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-purple-300 p-6">
            {
                loading && (<Loading text={"Logging You in..."} />)
            }
            {
                success && (<SuccessPopup message="You have been log in SuccessFully!   " size="lg" />)
            }
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">

                {/* Back to Home Button */}
                <button onClick={() => navigate('/')} className="absolute top-4 left-4 text-purple-600 hover:text-purple-800">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Login</h2>
                <div className="text-red-600 text-center font-bold">{error}</div>
                {/* Form Fields */}
                <form
                    onSubmit={formSubmit}
                    className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-500" />
                        <input type="email"
                            onChange={(e) => { setEmail(e.target.value) }}
                            placeholder="Email" className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-500" />
                        <input type="password"
                            onChange={(e) => {
                                // console.log(e.target.value)
                                setpassword(e.target.value)
                            }}
                            placeholder="Password" className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>

                    <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">Login</button>
                </form>

                {/* Signup Link */}
                <p className="text-center text-gray-600 mt-4">
                    Don't have an account? <Link to="/signup" className="text-purple-600 hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
