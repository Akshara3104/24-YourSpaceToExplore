

const { mongoose } = require('mongoose')
const CommunityModel = require('../models/community.model')
const UserModel = require('../models/user.model')


const { io } = require('../lib/socket.lib')
const CommunityMessagesModel = require('../models/communityMessages.mode')
const CommunityPostModel = require('../models/communityPost.model')


exports.createCommunity = async (req, res)=>{
    try {
        
        const { newCommunity, createdBy } = req.body

        const community = new CommunityModel({
            title: newCommunity.title,
            image: newCommunity.image,
            description: newCommunity.description,
            createdBy: createdBy,
            tags: newCommunity.tags,
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

exports.getCommunityDetails = async (req, res)=>{
    try {
        const { communityId, userId } = req.body

        const community = await CommunityModel.findOne({ _id: communityId })

        const posts = await CommunityPostModel.find({ communityId: communityId }).sort({ createdAt:-1 })

        const isJoined = community.members.includes(userId)

        return res.status(200).json({ success: true, community, posts, isJoined, message: 'Community fetched' })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

exports.editProfile = async(req, res)=>{
    try {
        const { communityId, newData } = req.body

        const community = await CommunityModel.findById(communityId)

        community.title = newData.title
        community.image = newData.image
        community.description = newData.description
        community.tags = newData.tags

        await community.save()

        return res.status(200).json({
            success: true,
            message: 'Edited'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error'
        })
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
        return res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
}

exports.toggleJoin = async(req, res)=>{
    try {
        const { communityId, userId, joined } = req.body
        const community = await CommunityModel.findOne({ _id: communityId });
        const user = await UserModel.findOne({ _id: userId });

        if (!community || !user) {
        return res.status(404).json({ success: false, message: "Community or user not found" });
        }

        if (!joined) {
            if (!community.members.includes(userId)) {
                community.members.push(userId);
            }

            if (!user.communitiesJoined.includes(communityId)) {
                user.communitiesJoined.push(communityId);
            }

            await community.save();
            await user.save();

            return res.status(200).json({ success: true, message: "Joined community successfully" });

        } else {
            community.members = community.members.filter(
                (memberId) => memberId.toString() !== userId.toString()
            );

            user.communitiesJoined = user.communitiesJoined.filter(
                (joinedId) => joinedId.toString() !== communityId.toString()
            );

            await community.save();
            await user.save();

            return res.status(200).json({ success: true, message: "Left community successfully" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
}



exports.getMembers = async (req, res) => {
    try {
        const { communityId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(communityId)) {
            return res.status(400).json({ success: false, message: "Invalid community ID" });
        }

        const community = await CommunityModel.findById(communityId)
            .populate([
                {
                    path: 'createdBy',
                    select: 'name _id profilePicture'
                },
                {
                    path: 'members',
                    select: 'name _id profilePicture'
                }
            ]);

        const filteredMembers = community.members.filter(
            (member) => member._id.toString() !== community.createdBy._id.toString()
        );

        return res.status(200).json({
            success: true,
            message: 'Fetched successfully',
            createdBy: community.createdBy,
            members: filteredMembers
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};



exports.getMessages = async (req, res)=>{
    try {
        const {communityId} = req.body
        const messages = await CommunityMessagesModel.find({ communityId })
            .populate({
                path: 'senderId',
                select: 'name profilePicture'
            })
            .sort({ createdAt: 1 })

        res.status(200).json({
            success: true,
            messages,
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
        io.to(communityId).emit("receiveCommunityMessage", {...msg._doc, tempId, photoName});
    }); 

    socket.on("leaveCommunity", (communityId) => {
        socket.leave(communityId);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
