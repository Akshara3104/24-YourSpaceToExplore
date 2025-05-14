
const express = require('express');
const { getPeople, sendMessage, getMessages } = require('../controllers/messages.controller');
const router = express.Router();

router.post('/getPeople', getPeople);
router.post('/sendMessage', sendMessage);
router.post('/getMessages', getMessages);

module.exports = router;