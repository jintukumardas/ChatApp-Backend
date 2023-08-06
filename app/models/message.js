const mongoose = require("mongoose");

// Create a message schema
const messageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  date: { type: String, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
