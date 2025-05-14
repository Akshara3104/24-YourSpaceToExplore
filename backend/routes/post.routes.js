
const express = require('express')

const router = express.Router()

const { createPost, getPosts, getComments, addComment, toggleLike } = require('../controllers/post.controller')


router.post('/createPost', createPost)
router.post('/getPosts', getPosts)
router.post('/getComments', getComments)
router.post('/addComment', addComment)
router.post('/toggleLike', toggleLike)

module.exports = router