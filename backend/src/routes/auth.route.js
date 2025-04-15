import { Router } from "express";
import { loginUser, UserRegister, userProfile } from "../controllers/auth.controller.js";
import multer from "multer"
import { Decode } from "../middlewares/decode.jwt.js";

const Userrouter = Router();
const upload = multer();

Userrouter.post("/register", upload.any(), UserRegister);
Userrouter.post("/login", upload.any(), loginUser);
Userrouter.get("/get", Decode, userProfile)


export default Userrouter