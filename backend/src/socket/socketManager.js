import jwt from "jsonwebtoken"
function connectSocket(io) {
    console.log("working")
    io.use((socket, next) => {
        const token = socket.handshake.auth.token
        const userToken = socket.handshake.auth.userDataToken
        try {
            const room = jwt.verify(token, process.env.Secret_Key);
            socket.room = room;
            const user = jwt.verify(userToken, process.env.Secret_Key)
            socket.user = user;
            // console.log("room : ", socket.room);
            // console.log("user : ", socket.user);
            next();
        } catch (err) {
            console.log("Invalid token:", err.message);
            next(new Error("The Token you provided is not valid."));
        }
    })

    let participants = [];
    io.on("connection", (socket) => {
        participants.push({ name: socket.room.owner, email: socket.room.createdBy, role: "owner" });


        socket.on("alert", (payload) => {
            console.log(payload)
        });


        socket.on("joinRoom", () => {
            // console.log("join room request", socket.room)
            socket.join(socket.room.roomId)
            participants.push({ name: socket.user.name, email: socket.user.email, role: "viewer" });

            socket.emit("roomData", {
                "roomName": socket.room.roomName,
                "roomId": socket.room.roomId,
                "MyName": socket.user.name,
                "ownerMail": socket.room.createdBy,
                "yourMail": socket.user.email,
                "password": socket.room.password
            })

            io.to(socket.room.roomId).emit("members", participants)
        })


        socket.on("note", (payload) => {
            socket.to(socket.room.roomId).emit("reciveNote", payload)
            // console.log(payload)
        })

        socket.on("endRoom", () => {
            socket.to(socket.room.roomId).emit("endRoom", "Room Disconnected")
        })

        socket.on("removeMember", (payload) => {
            console.log(payload)
            io.emit("forceRemove", "data")
            io.to(socket.room.roomId).emit("forceRemove", payload);
        })

        socket.on("disconnect", () => {
            const updatedArr = participants.filter(obj => obj.email !== socket.user.email);
            participants = updatedArr
            socket.to(socket.room.roomId).emit("members", participants)
        })

    })
}

export default connectSocket;
