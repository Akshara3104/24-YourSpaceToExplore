
const mongoose = require('mongoose')


const CommunityMessagesSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'community'
    },
    text : {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    },
    {timestamps: true}
)

CommunityMessagesSchema.index({ communityId: 1, createdAt: -1 });

const CommunityMessagesModel = new mongoose.model('communitymessages', CommunityMessagesSchema)

module.exports = CommunityMessagesModel