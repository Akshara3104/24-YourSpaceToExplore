

const { default: mongoose } = require('mongoose')
const CommunityModel = require('../models/community.model')
const UserModel = require('../models/user.model')


const { io } = require('../lib/socket.lib')
const CommunityMessagesModel = require('../models/communityMessages.mode')


exports.createCommunity = async (req, res)=>{
    try {
        
        const {title, description, image, tags, createdBy, isPrivate} = req.body

        const community = new CommunityModel({
            title,
            description,
            image,
            tags: tags||[],
            createdBy,
            isPrivate,
            members: [createdBy]
        })

        await community.save()

        await UserModel.findByIdAndUpdate(
            createdBy,
            { $push: { communitiesJoined: community._id } },
            { new: true }
        );

        return res.status(200).json({success: true, message: "Community created successfully", communityId: community._id})

    } catch (error) {

        console.log('Error occured while creating community')
        return res.status(500).json({success: false, message: "Error occured while creaating community"})
        
    }
}


exports.getCommunities = async (req, res)=>{
    try {
        
        const {userId} = req.body

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({success: false, message: "Invalid user"})
        }

        const user = await UserModel.findById(userId).select("communitiesJoined");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const communities = await CommunityModel.find(
            { _id: { $in: user.communitiesJoined } }
        ).select("title image");

        return res.status(200).json({
            success: true,
            message: "Fetched joined communities",
            communities
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error occured while fetching'
        })
    }
}



exports.getAllCommunities = async (req, res)=>{
    try {
        
        const communities = await CommunityModel.find().select('_id title')

        return res.status(200).json({success: true, message: 'fetched', communities})

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error'})
    }
}


exports.joinCommunity = async (req, res) => {

    try {
        const { userId, communityId } = req.body;

        if (!userId || !communityId) {
            return res.status(400).json({ success: false, message: 'User ID and Community ID are required' });
        }

        const community = await CommunityModel.findById(communityId);

        if (!community) {
            return res.status(404).json({ success: false, message: 'Community not found' });
        }

        if (community.members.includes(userId)) {
            return res.status(400).json({ success: false, message: 'User already a member' });
        }

        community.members.push(userId);
        await community.save();

        await UserModel.findByIdAndUpdate(
            userId,
            { $addToSet: { communitiesJoined: community._id } },
            { new: true }
        );

        return res.status(200).json({ success: true, message: 'Joined community successfully', community });

    } catch (error) {
        console.error('Error joining community:', error);
        return res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
}



exports.getMembers = async (req, res)=>{
    try {
        
        const { communityId } = req.body

        if(!mongoose.Types.ObjectId.isValid(communityId)){
            return res.status(400).json({success: false, message: "Invalid user"})
        }

        const community = await CommunityModel.findById(communityId)
                                    .populate({
                                        path: 'members',
                                        select: 'name _id image'
                                    })

        return res.status(200).json({
            success: true, 
            message: 'Members fetched successfully', 
            members: community.members
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false, 
            message: 'Error occured'
        })
    }   
}


exports.getMessages = async (req, res)=>{
    try {
        const {communityId} = req.body
        const messages = await CommunityMessagesModel.find({ communityId })
            .populate({
                path: 'senderId',
                select: 'name profilePicture'
            })
            .sort({ createdAt: 1 })
            // .skip((page - 1) * limit)
            // .limit(parseInt(limit));

        if (!messages.length) {
            return res.status(404).json({ success: false, message: 'No messages found' });
        }

        res.status(200).json({
            success: true,
            messages,
            // currentPage: page,
            // totalMessages: await CommunityMessagesModel.countDocuments({ communityId })
        });
    } catch (error) {
        res.status(400).json({success: false, message: 'Error occured'})
    }
}


io.on("connection", (socket) => {
    socket.on("joinCommunity", (communityId) => {
        socket.join(communityId);
    });

    socket.on("sendCommunityMessage", async ({ communityId, senderId, text, image, tempId }) => {
        const msg = new CommunityMessagesModel({ communityId, senderId, text, image });
        await msg.save();
        const photoName = await UserModel.find({_id: senderId._id}).select('profilePicture name')
        console.log(photoName)
        io.to(communityId).emit("receiveCommunityMessage", {...msg._doc, tempId, photoName});
    }); 

    socket.on("leaveCommunity", (communityId) => {
        socket.leave(communityId);
    });

    socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
    });
});
