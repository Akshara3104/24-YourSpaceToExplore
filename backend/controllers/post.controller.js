
const mongoose = require('mongoose')

const PostModel = require('../models/post.model')
const CommentModel = require('../models/comment.model')

exports.createPost = async (req, res)=>{
    try {
        
        const { userId, image, caption, tags, likes } = req.body

        const newPost = new PostModel({
            userId,
            image,
            caption,
            tags: tags || [],
            likes: []
        })

        await newPost.save()

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



exports.getComments = async (req, res)=>{
    try {
        const { postId, userId } = req.body
        const comments = await CommentModel.find({postId}).sort({createdAt: -1})
        const post = await PostModel.findOne({_id: postId})
        const liked = post.likes.some(id => id.equals(userId));
        const likesCount = post.likes.length
        return res.json({ success: true, comments, liked, likesCount, message: 'Comments fetched successfully' })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error occured" })
    }
}

exports.addComment = async (req, res)=>{
    try {
        const { postId, userId, comment, name, profilePicture } = req.body
        
        const newComment = new CommentModel({postId, userId, name, profilePicture, comment})
        
        await newComment.save()
        
        return res.status(200).json({ success: true, message: 'Comment added' })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Error occured' })
    }
}


exports.toggleLike = async (req, res)=>{
    try {
        const { postId, userId } = req.body
        const post = await PostModel.findOne({_id: postId})
        if(!post){
            console.log('No post')
            return null
        }
        const liked = post.likes.some(id=>id.equals(userId))
        if(liked)   post.likes.pull(userId)
        else    post.likes.push(userId)
        await post.save()
        return res.status(200).json({ success: true, message: 'Liked toggled', likesCount: post.likes.length })
        // return res.status(200).json({ success: true, message: 'emo' })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}