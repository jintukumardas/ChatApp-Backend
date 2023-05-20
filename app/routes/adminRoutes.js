const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin routes
router.post("/users", adminController.createUser);  // Create a new user
router.put("/users/:userId", adminController.updateUser); // Update a user

module.exports = router;
