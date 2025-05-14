const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "default-avatar.png", // Can be stored on Cloudinary or Firebase
    },
    bio: {
        type: String,
        maxlength: 300,
    },
    careerInterests: [
        {
            type: String,
            trim: true, // Example: ["Marketing", "Law", "Design"]
        },
    ],
    communitiesJoined: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
        },
    ],
    mentors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // Users who are mentors
        },
    ],
    mentees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // Users being mentored
        },
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            content: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
    notifications: [
        {
            message: String,
            isRead: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    settings: {
        privacy: {
            showProfileToPublic: { type: Boolean, default: true },
        },
        notifications: {
            emailNotifications: { type: Boolean, default: true },
            pushNotifications: { type: Boolean, default: true },
        },
    },
    },
    { timestamps: true }
)

const UserModel = new mongoose.model('user', UserSchema)

module.exports = UserModel