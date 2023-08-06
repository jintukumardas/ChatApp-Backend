const mongoose = require("mongoose");

// Create a user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  date: { type: String,  default: Date.now},
});

// Check if a user is an admin
userSchema.statics.isAdmin = function (userId) {
  return this.findById(userId).then((user) => {
    if (user && user.role === "admin") {
      return true;
    }
    return false;
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
