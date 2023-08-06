const { body } = require("express-validator");

// Validation middleware
const validateMessage = [
  body("groupId").isMongoId().withMessage("Invalid groupId"),
  body("senderId").isMongoId().withMessage("Invalid senderId"),
  body("content").notEmpty().withMessage("Content is required"),
];

module.exports = { validateMessage };