// Message routes

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/messages', messageController.sendMessage); // Send a message
router.get('/messages/:groupId', messageController.getMessages);//retrieve messages from group
router.post('/messages/:messageId/like', messageController.likeMessage); // Like a message

module.exports = router;
