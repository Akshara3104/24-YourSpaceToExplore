
const mongoose = require('mongoose')

const PostModel = require('../models/post.model')
const CommentModel = require('../models/comment.model')
const UserModel = require('../models/user.model')
const CommunityPostModel = require('../models/communityPost.model')
const NotificationModel = require('../models/notification.model')

exports.createUserPost = async (req, res)=>{
    try {
        
        const { userId, newPost  } = req.body

        const post = new PostModel({
            userId,
            image: newPost.image,
            caption: newPost.caption,
        })

        await post.save()

        return res.status(200).json({ success: true, message: 'Post successfully ' })

    } catch (error) {

        return res.status(400).json({ success: false, message: 'Error occured'})
        
    }
}


exports.createCommunityPost = async (req, res)=>{
    try {
        
        const { communityId, newPost  } = req.body

        const post = new CommunityPostModel({
            communityId,
            image: newPost.image,
            caption: newPost.caption,
        })

        await post.save()

        return res.status(200).json({ success: true, message: 'Post successfully ' })

    } catch (error) {

        return res.status(400).json({ success: false, message: 'Error occured'})
        
    }
}


exports.getPosts = async (req, res)=>{
    try {
        
        const { userId } = req.body

        const posts = await PostModel.find({userId: userId})

        return res.status(200).json({ success: true, message: 'Posts fetched successfully', posts })
        
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occured' })
    }
}


exports.getCommunityPosts = async(req, res)=>{
    try {
        const { communityId } = req.body
        
        const posts = await CommunityPostModel.find({ communityId: communityId })
        
        return res.status(200).json({ success: true, posts, message: 'Community posts fetched' })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occured' })
        
    }
}


exports.getCommentsLikes = async (req, res)=>{
    try {
        const { postId, userId, type } = req.body
        const comments = await CommentModel.find({postId}).sort({createdAt: -1})

        let post=null
        if(type==='user'){
            post = await PostModel.findOne({_id: postId})
        }
        else{
            post = await CommunityPostModel.findOne({_id: postId})
        }

        const likedBy = await UserModel.find(
            {_id: {$in: post.likes }},
            { name:1, profilePicture:1 }
        )
        const liked = post.likes.some(id => id.equals(userId));
        const likesCount = post.likes.length
        return res.json({ success: true, comments, liked, likesCount, likedBy, message: 'Likes and Comments fetched successfully' })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error occured" })
    }
}

exports.addComment = async (req, res)=>{
    try {
        const { postId, userId, comment, name, profilePicture, fromId } = req.body
        
        const newComment = new CommentModel({postId, userId, name, profilePicture, comment})
        
        await newComment.save()

        const notification = new NotificationModel({
            userId: fromId,
            type: 'comment',
            comment,
            fromId: userId,
            profilePicture,
            name
        })

        await notification.save()

        
        return res.status(200).json({ success: true, message: 'Comment added', commendId: newComment._id })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occured' })
    }
}


exports.deleteComment = async(req, res)=>{
    try {
        const { commentId } = req.body
        const deletedComment = await CommentModel.findByIdAndDelete(commentId);
        return res.status(200).json({ success: true, message: 'Deleted' })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error occured' })
    }
}


exports.toggleLike = async (req, res)=>{
    try {
        const { postId, userId, type, fromId, name, profilePicture } = req.body

        let post=null
        if(type==='user'){
            post = await PostModel.findOne({_id: postId})
        }
        else{
            post = await CommunityPostModel.findOne({_id: postId})
        }
        if(!post){
            return null
        }
        const liked = post.likes.some(id=>id.equals(userId))
        if(liked)   post.likes.pull(userId)
        else{
            post.likes.push(userId)
            if(type==='user'){
                const notification = new NotificationModel({
                    userId: fromId,
                    type: 'like',
                    fromId: userId,
                    profilePicture,
                    name
                })

                await notification.save()
            }
        }
        await post.save()
        return res.status(200).json({ success: true, message: 'Liked toggled', likesCount: post.likes.length })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


exports.deletePost = async(req, res)=>{
    try {
        const { postId, type } = req.body

        if(type==='user'){
            await PostModel.deleteOne({_id: postId})
        }else{
            await CommunityPostModel.deleteOne({_id: postId})
        }
        await CommentModel.deleteMany({postId})

        return res.status(200).json({ success: true, message: 'Post deleted' })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}