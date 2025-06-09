
const express = require('express')

const router = express.Router()

const { createUserPost, createCommunityPost, getPosts, getCommunityPosts, getCommentsLikes, addComment, deleteComment, toggleLike, deletePost } = require('../controllers/post.controller')


router.post('/createUserPost', createUserPost)
router.post('/createCommunityPost', createCommunityPost)
router.post('/getPosts', getPosts)
router.post('/getCommunityPosts', getCommunityPosts)
router.post('/getCommentsLikes', getCommentsLikes)
router.post('/addComment', addComment)
router.post('/deleteComment', deleteComment)
router.post('/toggleLike', toggleLike)
router.post('/deletePost', deletePost)

module.exports = router