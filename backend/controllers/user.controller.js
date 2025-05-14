
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const CommunityModel = require('../models/community.model')
const mongoose = require('mongoose');

exports.follow = async (req, res)=>{
    try{
        const { userId, targetId } = req.body;

        if(userId===targetId){
            return res.status(400).json({ success: false, message: "You cannot follow yourself" })
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
            return res.status(400).json({ success: false, message: "You cannot unfollow yourself" })
        }

        await UserModel.findByIdAndUpdate(userId, { $pull: { following: targetId } });

        await UserModel.findByIdAndUpdate( targetId, { $pull: { followers: userId } });

        return res.status(200).send({success: true, message: 'Unfollowed'})

    }catch(error){
        console.log(error.message)
        return res.status(400).send({success: false, message: 'Error occured' })
    }
}


exports.getFollowers = async (req, res)=>{

    try {
        const {userId} = req.body
        const followers = await UserModel.findById(userId)
            .populate({
                path: 'followers',
                select: 'name email profilePicture' // Fetch specific details
            })
            .select('followers');

        return res.status(200).json({success: true, message: 'Followers fetched', followers: followers.followers})
    } catch (error) {
        return res.status(400).json({success: false, message: 'Error'})   
        
    }
}

exports.getFollowing = async (req, res)=>{

    try {
        const {userId} = req.body
        const following = await UserModel.findById(userId)
                .populate({
                    path: 'following',
                    select: 'name email profilePicture' // Fetch specific details
                })
                .select('following');

        return res.status(200).json({success: true, message: 'Following fetched', following: following.following})
    } catch (error) {
        return res.status(400).json({success: false, message: 'Error'})   
    }
}


exports.getMyProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        console.log('from', userId)

        const userProfile = await UserModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(userId) } // Find the user
            },
            {
                $addFields: {
                    followerCount: { $size: "$followers" },
                    followingCount: { $size: "$following" }
                }
            },
            {
                $lookup: {
                    from: "posts", // Reference to posts collection
                    localField: "_id",
                    foreignField: "userId",
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
                    posts: { _id: 1, image: 1, caption: 1, createdAt: 1 } // Return only required fields
                }
            }
        ]);

        if (!userProfile.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, userProfile: userProfile[0] });

    } catch (error) {
        console.error(error);
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
      .select('name profilePicture followers following')
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
        name: targetUser.name,
        profilePicture: targetUser.profilePicture,
        followersCount: targetUser.followers.length,
        followingCount: targetUser.following.length,
        postsCount: posts.length,
        posts,
      },
      isFollowing,
    });

  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
}


exports.getConnections = async (req, res) => {
	try {
		const { targetId, type } = req.body;
		const targetUser = await UserModel.findById(targetId).populate(type, 'name profilePicture');
		res.status(200).json({ users: targetUser[type] });
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};




exports.createPost = async (req, res)=>{
    try {
        const {userId, newPost} = req.body;
        const post = new PostModel({
            userId,
            image: newPost.image,
            caption: newPost.caption
        })

        await post.save();

        return res.status(200).send({success: true, message: 'New post created'})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
}



exports.search = async (req, res)=>{
    try {
        const { query } = req.body

        const users = await UserModel.find({
            name: { $regex: query , $options: "i"} 
        }).select('_id name profilePicture')

        const communities = await CommunityModel.find({
            title: { $regex: query , $options: "i"} 
        }).select('_id title image')
        

        return res.status(200).json({ success: true, message: 'Search results fetched', users, communities })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}