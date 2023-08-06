const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateLoginInput = require("../utility/validator-login");

// Login a user
async function login(req, res) {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  // Find user by username
  User.findOne({ username }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ usernamenotfound: "Username not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched, create JWT Payload
        const payload = {
          id: user.id,
          username: user.username,
        };

        //JWT Secret key
        const key = process.env.ADMIN_KEY;

        // Sign token
        jwt.sign(
          payload,
          key,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              username: user.username,
              userId: user._id,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
}

// Logout a user
async function logout(req, res) {
  try {
    // Destroy user session
    req.session.destroy();
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to logout user" });
  }
}

module.exports = {
  login,
  logout,
};
