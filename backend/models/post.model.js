

const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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

const PostModel = mongoose.model('post', PostSchema)

module.exports = PostModel