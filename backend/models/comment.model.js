

const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    },
    {timestamps: true}
)

CommentSchema.index({ postId: 1, createdAt: -1 });

const CommentModel = new mongoose.model('comment', CommentSchema)

module.exports = CommentModel