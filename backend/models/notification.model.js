const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    fromId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    profilePicture:{
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['follow', 'like', 'comment'],
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        default: null
    },
    comment:{
        type: String,
        default: null
    },
    opened:{
        type: Boolean,
        default: false
    }
    },{timestamps: true }
)

const NotificationModel = new mongoose.model('notification', NotificationSchema)

module.exports = NotificationModel