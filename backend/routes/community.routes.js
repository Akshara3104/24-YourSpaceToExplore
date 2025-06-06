

const express = require('express');
const { createCommunity, getCommunities, getMembers, joinCommunity, getMessages, getCommunityDetails, toggleJoin } = require('../controllers/community.controller');
const router = express.Router();

router.post('/createCommunity', createCommunity);
router.post('/getCommunities', getCommunities);
router.post('/getMembers', getMembers);
router.post('/joinCommunity', joinCommunity);
router.post('/getMessages', getMessages);
router.post('/getCommunityDetails', getCommunityDetails);
router.post('/toggleJoin', toggleJoin);

module.exports = router;