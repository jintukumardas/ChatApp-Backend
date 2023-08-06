// Authenticated routes

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login); // Login
router.post('/logout', authController.logout); // Logout

module.exports = router;
