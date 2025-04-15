import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ownerMail: {
            type: String,
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

// Create Folder model
const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
