const mongoose = require('mongoose')


const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true, 
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
    },
    { timestamps: true }
)

MessageSchema.index({ conversationId: 1, createdAt: -1 });

const MessagesModel = new mongoose.model('messages', MessageSchema)

module.exports = MessagesModel