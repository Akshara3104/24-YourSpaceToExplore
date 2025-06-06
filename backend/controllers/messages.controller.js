
const { text } = require('express');
const MessagesModel = require('../models/messages.model')
const UserModel = require('../models/user.model')
const mongoose = require('mongoose')

const { io } = require('../lib/socket.lib')



exports.getPeople = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        const objectUserId = new mongoose.Types.ObjectId(userId); 

        const recentChats = await MessagesModel.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: objectUserId },
                        { targetId: objectUserId },
                    ],
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $group: {
                    _id: "$conversationId",
                    lastInteraction: { $first: "$createdAt" }, 
                    senderId: { $first: "$senderId" },
                    targetId: { $first: "$targetId" },
                },
            },
            {
                $sort: { lastInteraction: -1 },
            },
            {
                $addFields: {
                    otherUserId: {
                        $cond: {
                            if: { $eq: ["$senderId", objectUserId] },
                            then: "$targetId",
                            else: "$senderId",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "otherUserId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $project: {
                    _id: "$userDetails._id",
                    name: "$userDetails.name",
                    profilePicture: "$userDetails.profilePicture",
                    lastInteraction: 1,
                },
            },
        ]);

        return res.status(200).json({ success: true, message: "Fetched", recentChats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
};



exports.getMessages = async (req, res)=>{
    try {
        const {userId, targetId} = req.body;

        const conversationId = userId < targetId ? `${userId}_${targetId}` : `${targetId}_${userId}`;

        const messages = await MessagesModel.find({ conversationId })

        const groups = {};

        messages.forEach(msg => {
            const date = new Date(msg.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric"
            });

            if (!groups[date]) groups[date] = [];
            groups[date].push(msg);
        });

        res.status(200).json({success: true, messages: groups})
    } catch (error) {
        res.status(400).json({success: false, message: 'Error occured'})
    }
}

exports.sendMessage = async (req, res)=>{
    try {
        const {senderId, targetId, text, image} = req.body;

        const conversationId = senderId < targetId ? `${senderId}_${targetId}` : `${targetId}_${senderId}`;

        const message = new MessagesModel({
            conversationId,
            senderId: senderId,
            targetId: targetId,
            text: text,
            image: image || ''
        })

        await message.save();
        res.status(200).json({ success: true, message: 'Message sent'})
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error'})
    }
}


io.on("connection", (socket) => {

    socket.on("joinRoom", (userId) => {
        socket.join(userId);
    });

    socket.on("sendMessage", async ({ senderId, targetId, text, image }) => {

        const conversationId = senderId < targetId ? `${senderId}_${targetId}` : `${targetId}_${senderId}`;

        const message = new MessagesModel({
            conversationId,
            senderId: new mongoose.Types.ObjectId(senderId), 
            targetId: new mongoose.Types.ObjectId(targetId), 
            text: text,
          });
        await message.save();

        io.to(targetId).emit("receiveMessage", message);
    });
})
