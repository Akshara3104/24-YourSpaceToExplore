

const express = require('express');
const { follow, unfollow, getMyProfile, getUserProfile, getConnections, search, fetchByTags, toggleFollow, editProfile, getNotifications, makeAllRead, deleteAllNotifications } = require('../controllers/user.controller');
const router = express.Router();

router.post('/follow', follow);
router.post('/unfollow', unfollow);
router.post('/getMyProfile', getMyProfile);
router.post('/getUserProfile', getUserProfile);
router.post('/getConnections', getConnections);
router.post('/search', search);
router.post('/fetchByTags', fetchByTags);
router.post('/toggleFollow', toggleFollow);
router.post('/editProfile', editProfile);
router.post('/getNotifications', getNotifications)
router.post('/makeAllRead', makeAllRead)
router.post('/deleteAllNotifications', deleteAllNotifications)

module.exports = router;