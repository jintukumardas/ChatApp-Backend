const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const { connectToDatabase } = require("./app/db");
const adminRoutes = require("./app/routes/adminRoutes");
const authRoutes = require("./app/routes/authRoutes");
const groupRoutes = require("./app/routes/groupRoutes");
const messageRoutes = require("./app/routes/messageRoutes");
const User = require("./app/models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

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
dotenv.config();

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./app/config/passport")(passport);

// Session secret key
function generateSessionKey() {
  return crypto.randomBytes(32).toString("hex");
}

// Session middleware
app.use(
  session({
    secret: generateSessionKey(),
    resave: false,
    saveUninitialized: true,
  })
);

//Admin Secret key
const secretKey = process.env.ADMIN_KEY;

//JWT Secret key
const key = process.env.ADMIN_KEY;

// Middleware to check if the request is coming from an admin
function isAdmin(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey); //Verify with admin jwt secret key
    if (decoded.role === "admin") {
      next(); // Admin is authorized, proceed to the next route handler
    } else {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Routes
app.use("/admin", isAdmin, adminRoutes); // Admin routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/groups", groupRoutes); // Group routes
app.use("/messages", messageRoutes); // Message routes

// Home route
app.get("/", (req, res) => {
  try {
    let jwtUser = jwt.verify(verify(req), key);
    let id = mongoose.Types.ObjectId(jwtUser.id);

    User.aggregate()
      .match({ _id: { $not: { $eq: id } } })
      .project({
        password: 0,
        __v: 0,
        date: 0,
      })
      .exec((err, users) => {
        if (err) {
          console.log(err);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Failure" }));
          res.sendStatus(500);
        } else {
          res.send(users);
        }
      });
  } catch (err) {
    console.log(err);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Unauthorized" }));
    res.sendStatus(401);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
