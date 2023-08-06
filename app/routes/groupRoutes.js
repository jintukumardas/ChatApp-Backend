// Group routes

const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/groups', groupController.createGroup);     // Create a new group
router.delete('/groups/:groupId', groupController.deleteGroup); // Delete group
router.get('/groups/:groupId/members/search/:userId', groupController.searchMembers); // Search members of a group
router.post('/groups/:groupId/members', groupController.addMember);  // Add a member to a group

module.exports = router;
