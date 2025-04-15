import { Router } from "express";
import { createLiveRoom, validateRoom, DeleteRoom } from "../controllers/LiveRoom.controller.js";
import { Decode } from "../middlewares/decode.jwt.js";

const LiverRoomRoute = Router();

LiverRoomRoute.post("/create", Decode, createLiveRoom)
LiverRoomRoute.post("/validate", Decode, validateRoom)
LiverRoomRoute.delete("/delete/:id", Decode, DeleteRoom)
export default LiverRoomRoute