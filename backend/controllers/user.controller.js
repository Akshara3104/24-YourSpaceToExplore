
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const CommunityModel = require('../models/community.model')
const NotificationModel = require('../models/notification.model')
const mongoose = require('mongoose');

exports.follow = async (req, res)=>{
    try{
        const { userId, targetId } = req.body;

        if(userId===targetId){
            return res.status(400).json({ success: false, message: "Invalid request" })
        }

        await UserModel.findByIdAndUpdate(userId, { $addToSet: { following: targetId } });

        await UserModel.findByIdAndUpdate( targetId, { $addToSet: { followers: userId } });

        return res.status(200).send({success: true, message: 'Following'})

    }catch(error){
        console.log(error.message)
        return res.status(400).send({success: false, message: 'Error occured' })
    }
}

exports.unfollow = async (req, res)=>{
    try{
        const { userId, targetId } = req.body;

        if(userId===targetId){
            return res.status(400).json({ success: false, message: "Invalid request" })
        }

        await UserModel.findByIdAndUpdate(userId, { $pull: { following: targetId } });

        await UserModel.findByIdAndUpdate( targetId, { $pull: { followers: userId } });

        return res.status(200).send({success: true, message: 'Unfollowed'})

    }catch(error){
        return res.status(400).send({success: false, message: 'Error occured' })
    }
}


exports.getMyProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        const userProfile = await UserModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(userId) } // Find the user
            },
            {
                $addFields: {
                    followerCount: { $size: "$followers" },
                    followingCount: { $size: "$following" },
                    communitiesCount: { $size: "$communitiesJoined" }
                }
            },
            {
                $lookup: {
                    from: "posts",
                    let: { userId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
                        { $sort: { createdAt: -1 } },
                        { $project: { _id: 1, image: 1, caption: 1, createdAt: 1 } }
                    ],
                    as: "posts"
                }
            },
            {
                $project: {
                    name: 1,
                    profilePicture: 1,
                    bio: 1,
                    careerInterests: 1,
                    followerCount: 1,
                    followingCount: 1,
                    communitiesCount: 1,
                    posts: { _id: 1, image: 1, caption: 1, createdAt: 1 }
                }
            }
        ]);

        if (!userProfile.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, userProfile: userProfile[0] });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getUserProfile = async (req, res)=>{
    try {
    const { userId, targetId } = req.body;

    if (!userId || !targetId) {
      return res.status(400).json({ message: "Missing userId or targetId" });
    }

    // Get basic profile info of target user
    const targetUser = await UserModel.findById(targetId)
      .select('name profilePicture followers following bio careerInterests communitiesJoined')
      .lean();

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get posts made by the target user
    const posts = await PostModel.find({ userId: targetId }).sort({ createdAt: -1 });

    // Determine if the current user is following the target user
    const isFollowing = targetUser.followers
        .map(followerId => followerId.toString())
        .includes(userId.toString());


    // Send response
    res.status(200).json({
      userProfile: {
        _id: targetUser._id,
        name: targetUser.name,
        profilePicture: targetUser.profilePicture,
        followersCount: targetUser.followers.length,
        followingCount: targetUser.following.length,
        communitiesCount: targetUser.communitiesJoined.length,
        postsCount: posts.length,
        posts,
        bio: targetUser.bio,
        careerInterests: targetUser.careerInterests
      },
      isFollowing,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}


exports.getConnections = async (req, res) => {
	try {
		const { targetId, type } = req.body;
        if(type==='Communities'){

            const user = await UserModel.findById(targetId).select('communitiesJoined');
			if (!user) return res.status(404).json({ message: 'User not found' });

			const communities = await CommunityModel.find({
				_id: { $in: user.communitiesJoined }
			}).select('title image');

            const users = communities.map(c => ({
                _id: c._id,
                name: c.title,
                profilePicture: c.image
            }));

            res.status(200).json({ success: true, message: 'Communities fetched successfully', users })
        }else{
		    const targetUser = await UserModel.findById(targetId).populate(type.toLowerCase(), 'name profilePicture');
            res.status(200).json({ success: true, message: 'Users fetched successfully', users: targetUser[type.toLowerCase()] });
        }
	} catch (err) {
		res.status(500).json({ success: false, message: "Server error" });
	}
};



exports.search = async (req, res)=>{
    try {
        const { query } = req.body

        const users = await UserModel.find({
            name: { $regex: query , $options: "i"} 
        }).select('_id name profilePicture bio')

        const communities = await CommunityModel.find({
            title: { $regex: query , $options: "i"} 
        }).select('_id title image description')
        

        return res.status(200).json({ success: true, message: 'Search results fetched', users, communities })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


exports.fetchByTags = async (req, res)=>{
    try {
        const {tag} = req.body;

        const users = await UserModel.aggregate([
            { $match: { careerInterests: { $regex: new RegExp(`^${tag}$`, 'i') } } },
            {
                $addFields: {
                followerCount: { $size: { $ifNull: ["$followers", []] } }
                }
            },
            { $sort: { followerCount: -1 } },
            { $limit: 50 },
            {
                $project: {
                _id: 1,
                name: 1,
                profilePicture: 1,
                followerCount: 1,
                bio: 1
                }
            }
        ]);

            
        const communities = await CommunityModel.aggregate([
            { $match: { tags: tag } },
            {
                $addFields: {
                    memberCount: { $size: { $ifNull: ["$members", []] } }
                }
            },
            { $sort: { memberCount: -1 } },
            { $limit: 50 },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    image: 1,
                    memberCount: 1,
                    description: 1
                }
            }
        ]);
        
        return res.status(200).json({ success: true, message: 'Fetched successfully', users, communities })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


exports.toggleFollow =async(req, res)=>{
    try {
        const { userId, targetId, isFollowing } = req.body

        const user = await UserModel.findOne({ _id: userId })
        const targetUser = await UserModel.findOne({ _id: targetId })

        if(isFollowing){
            user.following.pull(targetId)
            targetUser.followers.pull(userId)
        }else{
            user.following.push(targetId)
            targetUser.followers.push(userId)
            const notification = new NotificationModel({
                userId: targetId,
                fromId: userId,
                type: 'follow',
                profilePicture: user.profilePicture,
                name: user.name
            })

            await notification.save()
        }
        await user.save()
        await targetUser.save()

        return res.status(200).json({ success: true, message: 'Toggled Follow', isFollowing: !isFollowing })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}


exports.editProfile = async (req, res)=>{
    try {
        const { userId, newData } = req.body

        const user = await UserModel.findOne({_id: userId})

        user.bio=newData.bio
        user.careerInterests = newData.careerInterests
        user.profilePicture = newData.profilePicture

        await user.save()

        return res.status(200).json({ success: true, message: 'Profile successfully edited' })
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
        
    }
}


exports.getNotifications = async(req, res)=>{
    try {
        const { userId } = req.body
        const notifications = await NotificationModel.find({ userId }).sort({createdAt: -1})

        const opened = notifications.filter(item=>item.opened)
        const notOpened = notifications.filter(item=>!item.opened)

        return res.status(200).json({
            success: true,
            opened,
            notOpened,
            message: 'Notifications successfully fetched'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.makeAllRead=async(req, res)=>{
    try {
        const { userId } = req.body;

        await NotificationModel.updateMany(
            { userId, opened: false },
            { $set: { opened: true } }        
        );

        return res.status(200).json({ success: true, message: "All notifications marked as read." });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


exports.deleteAllNotifications=async(req, res)=>{
    try {
        const { userId } = req.body;
        await NotificationModel.deleteMany({ userId });
        return res.status(200).json({ success: true, message: "All notifications deleted" });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Server error" });
    }
}
