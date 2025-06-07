

const mongoose = require('mongoose')

const CommunityPostSchema = mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community',
        required: true
    },
    image: {
        type: String,
        default: null
    },
    caption: {
        type: String,
        trim: true,
        default: ''
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
    },
    {timestamps: true}
)

const CommunityPostModel = mongoose.model('communityPost', CommunityPostSchema)

module.exports = CommunityPostModel