

const express = require('express');
const { follow, unfollow, getFollowers, getFollowing, getMyProfile, createPost, getUserProfile, getConnections, search } = require('../controllers/user.controller');
const router = express.Router();

router.post('/follow', follow);
router.post('/unfollow', unfollow);
router.post('/getFollowers', getFollowers);
router.post('/getFollowing', getFollowing);
router.post('/getMyProfile', getMyProfile);
router.post('/getUserProfile', getUserProfile);
router.post('/getConnections', getConnections)
router.post('/createPost', createPost);
router.post('/search', search);

module.exports = router;