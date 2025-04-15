import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        profile: {
            type: String, // Store profile image URL or file path
            default: "https://res.cloudinary.com/dyhtmxiiz/image/upload/v1737807716/tnbrcboqmqlekaenippx.jpg",
        },
        bio: {
            type: String, // Store profile image URL or file path

        },
    },
    { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Create User model
const User = mongoose.model("User", userSchema);

export default User;
