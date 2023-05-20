// Description: Controller for the message model

const Message = require("../models/message");

// Send a message
async function sendMessage(req, res) {
  try {
    const newMessage = await Message.create(req.body);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
}

// Like a message
async function likeMessage(req, res) {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if the user has already liked the message
    const isLiked = message.likes.includes(userId);
    if (isLiked) {
      return res
        .status(400)
        .json({ error: "Message is already liked by the user" });
    }

    // Add the user to the likes array
    message.likes.push(userId);
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to like message" });
  }
}

module.exports = {
  sendMessage,
  likeMessage,
};
