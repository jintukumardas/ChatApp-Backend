const User = require('../models/user');

// Login a user
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set user session
    req.session.user = user;

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
}

// Logout a user
async function logout(req, res) {
  try {
    // Destroy user session
    req.session.destroy();
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout user' });
  }
}

module.exports = {
  login,
  logout,
};
