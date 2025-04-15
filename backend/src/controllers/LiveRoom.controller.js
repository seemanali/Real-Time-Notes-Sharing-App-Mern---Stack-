import { nanoid } from "nanoid";
import LiveRoom from "../models/LiveRoom.model.js";
import { apiError, apiResponse } from "../Utlis/ApiResponse.js";
import jwt from "jsonwebtoken";

const createLiveRoom = async (req, res) => {
    const { roomName } = req.body;
    const roomId = nanoid()
    const password = nanoid();
    try {
        const Room = await LiveRoom.create({
            roomName: roomName || "No Room Name",
            roomId,
            owner: req.user.name,
            createdBy: req.user.email,
            password,
        })

        apiResponse(res, 200, "Room Created SuccessFully", Room)
    } catch (error) {
        console.log(error);
        apiError(res, 500, "Something Went Wrong");
    }

}

const validateRoom = async (request, response) => {
    const { id, password } = request.body;
    if (!id || !password) {
        apiResponse(response, 400, "Id and passwords ar erequired", {}, "Make sure you send id and password for room. If you send but still this error. Try using {application/json} header and method : POST");
    }
    try {
        const roomData = await LiveRoom.findOne({
            roomId: id, password
        });

        if (!roomData) return apiError(response, 400, "No Room found with This data");
        const newObj = roomData.toObject()

        const token = await jwt.sign(newObj, process.env.Secret_Key);
        apiResponse(response, 200, "Ceredtials Matched", { token }, "Attach this token with while connecting to socket");
    } catch (error) {
        console.log("error while validating room data", error);
        apiError(response, 500, "Something Went Wrong");
    }
}


const DeleteRoom = async (req, res) => {
    const { id } = req.params;

    if (!id) return apiError(res, 400, "Id not Found");
    try {
        const room = await LiveRoom.findOne({ roomId: id })
        if (!room) return apiError(res, 400, "Room With this ID not Found");

        if (room.createdBy != req.user.email) {
            return apiError(res, 401, "You are Unanuthorized to perform this action");
        }


        const response = await LiveRoom.deleteOne({ roomId: id });
        apiResponse(res, 200, "Room Deleted SuccessFully");
    } catch (error) {
        console.log(error)
        return apiError(res, 500, "Something went wrong");
    }

}

export {
    createLiveRoom,
    validateRoom,
    DeleteRoom
}