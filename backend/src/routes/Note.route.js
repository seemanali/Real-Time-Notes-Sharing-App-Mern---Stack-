import { Router } from "express";
import multer from "multer"
import { Decode } from "../middlewares/decode.jwt.js";
import { CreateNote, GetNote, DeleteNote, UpdateNote, TogglePublic, GetPublicNote, updateShareStatus, GetPublicNotes } from "../controllers/Note.controller.js";



const NoteRouter = Router();
const upload = multer();

NoteRouter.post("/create/:folderId", Decode, CreateNote)
    .get("/get/:id", Decode, GetNote)
    .delete("/delete/:id", Decode, DeleteNote)
    .put("/update/:id", Decode, UpdateNote)
    .put("/allow/public/:id", Decode, TogglePublic)
    .get("/public/:id", GetPublicNote)
    .put("/sharewith/:id", updateShareStatus)
    .get("/publicnotes", GetPublicNotes)



export default NoteRouter;