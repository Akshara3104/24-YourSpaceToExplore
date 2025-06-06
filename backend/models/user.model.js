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
        default: "",
    },
    bio: {
        type: String,
        maxlength: 300,
    },
    careerInterests: [
        {
            type: String,
            trim: true, 
        },
    ],
    communitiesJoined: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
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
    },
    { timestamps: true }
)

const UserModel = new mongoose.model('user', UserSchema)

module.exports = UserModel