import express from 'express'
import dotenv from "dotenv";
import ConnectDB from './src/db.js';
import cookieParser from "cookie-parser";
import Userrouter from './src/routes/auth.route.js';
import FolderRouter from './src/routes/Folder.route.js'
import NoteRouter from './src/routes/Note.route.js';
import cors from "cors"
import { Server } from 'socket.io';
import http from "http"
import connectSocket from './src/socket/socketManager.js';
import LiverRoomRoute from './src/routes/LiveRoom.route.js';


const app = express();
dotenv.config();

ConnectDB();


app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "authorization"]
}));




app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    },

});

// io.on("connect", () => {
//     console.log("connected")
// })

connectSocket(io)

app.use("/api/user", Userrouter);
app.use("/api/folder", FolderRouter);
app.use("/api/note", NoteRouter);
app.use("/api/liveroom", LiverRoomRoute)


server.listen(process.env.PORT, () => {
    console.log("app is running on ", process.env.PORT)
})