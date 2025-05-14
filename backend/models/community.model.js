
const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        default: "Image.png"
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",  // Reference to User model
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",  // List of community members (Users)
        }
    ],
    isPrivate: {
        type: Boolean,
        default: false,  // Public by default
    }
}, { timestamps: true }); // Auto adds createdAt & updatedAt

const CommunityModel = mongoose.model("Community", CommunitySchema);

module.exports = CommunityModel;
