const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const { connectToDatabase } = require('./app/db');
const adminRoutes = require('./app/routes/adminRoutes');
const authRoutes = require('./app/routes/authRoutes');
const groupRoutes = require('./app/routes/groupRoutes');
const messageRoutes = require('./app/routes/messageRoutes');
const User = require("./app/models/user");

/*
  Author: Jintu Kumar Das
  Date: 21-05-2023
  Description: Node.js Assignment
  Tasks:  Build a simple application which provides web services to facilitate group chat and manage data.
  Requirements:
    1. Admin APIs (only admin can add users)
      - Manage Users (create user, edit user)

    2. Any User (normal user, admin user) –
      - Authentication APIs (login, logout)

    3. Groups (Normal User) –
      - Manage groups (create, delete, search and add members, etc). All users are visible to all users.

    4. Group Messages (Normal User)
      - Send messages in group
      - Likes message, etc

    5. Test cases
      - Build simple e2e functional tests with Nodejs to prove APIs are working. (Mocha test framework is used here)
    
    6. Database
      - Use database of your choice (MongoDB is used here)
*/

const app = express();
connectToDatabase(); // Connect to the database
app.use(express.json());

// Session secret key
function generateSessionKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Session middleware
app.use(session({
  secret:  generateSessionKey(),
  resave: false,
  saveUninitialized: true
}));

// Admin middleware
const isAdmin = async (req, res, next) => {
  const adminId = process.env.ADMIN_ID; // for testing purpose using this admin id
  try {
    const user = await User.isAdmin(adminId);
    if (user) {
      next(); // User is an admin, proceed to the next route handler
    } else {
      res.status(403).json({ error: "Unauthorized" }); // User is not an admin
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to check admin status" });
  }
};

// Routes
app.use('/admin', isAdmin, adminRoutes); // Admin routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/groups', groupRoutes); // Group routes
app.use('/messages', messageRoutes); // Message routes


// Home route
app.get("/", (req, res) => {
  res.send("Riktam Technologies Node.js Assignment!");
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
