const User = require('../models/User');

// Get all users (admin or self only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-googleId'); // hide sensitive info
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current logged-in user
exports.getCurrentUser = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  res.json(req.user);
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new user (manual or OAuth already handled)
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update logged-in user (self only)
exports.updateUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not logged in' });
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-googleId');
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete logged-in user (self only) but keep session alive
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not logged in' });
    const userId = req.user.id;

    // Delete user from DB
    await User.findByIdAndDelete(userId);

    // Return success without destroying session
    res.json({ message: 'User deleted from database, but session remains active' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
