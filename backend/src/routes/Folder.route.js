import { Router } from "express";
import { FolderCreate, GetFolder, ListFolders, renameFolder, DeleteFolder, ShareFolderToggle, GetPublicFolders, GetPublicNote, updateShareStatus, GetSharedWithMe, GetFolderSharedWithME } from "../controllers/Folder.controller.js";
import multer from "multer"
import { Decode } from "../middlewares/decode.jwt.js";



const FolderRouter = Router();
const upload = multer();


FolderRouter.post("/create/:folderName", Decode, FolderCreate)
    .get("/list", Decode, ListFolders)
    .get("/get/:folderId", Decode, GetFolder)
    .post("/rename/:folderId/:newName", Decode, renameFolder)
    .delete("/delete/:folderId", Decode, DeleteFolder)
    .put("/allow/public/:id", Decode, ShareFolderToggle)
    .get("/public/:id", GetPublicNote)
    .put("/sharewith/:id", updateShareStatus)
    .get("/publicfolders", GetPublicFolders)
    .get("/sharedwithme", Decode, GetSharedWithMe)
    .get("/sharedwithme/folder/:id", Decode, GetFolderSharedWithME)



export default FolderRouter