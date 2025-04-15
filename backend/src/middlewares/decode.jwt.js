import jwt from "jsonwebtoken";
import { apiError } from "../Utlis/ApiResponse.js";

const Decode = async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];
    // console.log(token)
    if (!token) {
        return apiError(res, 401, "Unauthorized", "No token provided. Please log in.");
    }

    try {
        const decoded = jwt.verify(token, process.env.Secret_Key);
        // console.log(decoded)
        req.user = decoded;
        next();
    } catch (error) {
        // console.log(error)
        return apiError(res, 400, "Authentication Failed",
            "Invalid or expired token. If you lost your token ,Please log in again.");
    }
};

export { Decode };
