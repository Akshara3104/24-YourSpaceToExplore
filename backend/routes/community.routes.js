

const express = require('express');
const { createCommunity, getCommunities, getMembers, joinCommunity, getAllCommunities, getMessages } = require('../controllers/community.controller');
const router = express.Router();

router.post('/createCommunity', createCommunity);
router.post('/getCommunities', getCommunities);
router.post('/getMembers', getMembers);
router.post('/joinCommunity', joinCommunity);
router.post('/getAllCommunities', getAllCommunities);
router.post('/getMessages', getMessages);

module.exports = router;