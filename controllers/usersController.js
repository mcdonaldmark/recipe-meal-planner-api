const User = require('../models/User');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-googleId');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current logged-in user
const getCurrentUser = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  res.json(req.user);
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new user (optional if using Google OAuth)
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update logged-in user (only self)
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true
    }).select('-googleId');
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete logged-in user (only self)
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: `User ${req.user.id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
