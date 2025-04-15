import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        folder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            required: true,
        },
        sharedWith: [
            {
                type: String
            }
        ],
        urlAccess: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Create Note model
const Note = mongoose.model("Note", noteSchema);

export default Note;
