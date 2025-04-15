
import User from "../models/User.model.js";
import { apiError, apiResponse } from "../Utlis/ApiResponse.js"
import jwt from "jsonwebtoken";

const UserRegister = async (req, res) => {

    const { name, email, password, bio } = req.body;
    if (!name) { return apiError(res, 400, "Name is Required", "Make sure you must send name email and password. Bio and Profile Image is optional") }
    if (!email) { return apiError(res, 400, "Email is Required", "Make sure you must send name email and password. Bio and Profile Image is optional") }
    if (!password) { return apiError(res, 400, "Password is Required", "Make sure you must send name email and password. Bio and Profile Image is optional") }

    try {
        const user = await User.create({
            name, email, password, bio
        })
        const userObj = user.toObject();

        // Delete the password field
        console.log(userObj)
        delete userObj.password;

        apiResponse(res, 200, "User Created Successfully", userObj);
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return apiError(res, 400, "Email already exists. Please use a different one.");
        }
        return apiError(res, 400, error.errmsg);
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    console.log(email, password)
    if (!email) return apiError(res, 400, "Email is Required", "email and password are required for sucessfull auth!");
    if (!password) return apiError(res, 400, "Password is Required", "email and password are required for sucessfull auth!");

    try {

        const user = await User.findOne({ email, password });
        if (!user) return apiError(res, 400, "No User Found with such credentials");

        const newObj = {
            "_id": user._id,
            "name": user.name,
            "email": user.email
        }

        const token = await jwt.sign(newObj, process.env.Secret_Key, { expiresIn: "15d" });
        // console.log(token)

        return apiResponse(res, 200, "SuccessFully Logged In", { status: "success", token, userId: newObj._id, userEmail: newObj.email }, "Attach the Token in Header as Authrization to access the resources for specific user");

    } catch (error) {
        return apiError(res, 500, "Something went wrong");
    }

}


const userProfile = async (req, res) => {
    try {
        console.log(req.user._id);
        const response = await User.findOne({ email: req.user.email });
        if (response.email == req.user.email) {
            const obj = response.toObject()
            delete obj.password
            return apiResponse(res, 200, "Profile fetched successfully", obj);
        }
        return apiError(res, 401, "You are not allowed to perform this action")

    } catch (error) {
        console.log(error)
        return apiError(res, 500, "Something went wrong");
    }

}
export { UserRegister, loginUser, userProfile }