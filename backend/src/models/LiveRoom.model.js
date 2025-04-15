import mongoose from "mongoose"

const liveRoomSchema = new mongoose.Schema({

    roomName: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    owner: {
        type: String,
    },
    createdBy: {
        type: String,
        required: false
    },
    content: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LiveRoom = mongoose.model("LiveRoom", liveRoomSchema);
export default LiveRoom
