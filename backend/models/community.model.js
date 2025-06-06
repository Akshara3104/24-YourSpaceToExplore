
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
        default: ""
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ],
}, { timestamps: true });

const CommunityModel = mongoose.model("Community", CommunitySchema);

module.exports = CommunityModel;
