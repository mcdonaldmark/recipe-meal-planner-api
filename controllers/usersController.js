const User = require('../models/User');

// Get all users (authenticated)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-googleId'); // hide googleId
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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

// Create a new user (usually via OAuth)
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update logged-in user (self only)
const updateUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'You must be logged in' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only allow self-update
    if (user.id !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to update this user' });
    }

    const { firstName, lastName, email, username, locale } = req.body;
    const updateData = { firstName, lastName, email, username, locale };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-googleId');
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete logged-in user (self only)
const deleteUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'You must be logged in' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only allow self-delete
    if (user.id !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to delete this user' });
    }

    await User.findByIdAndDelete(req.params.id);

    // If Google OAuth user, keep session alive
    if (user.googleId) {
      return res.json({ message: 'User deleted, session still active (Google OAuth)' });
    }

    // If normal user, log them out
    req.logout(() => {
      res.json({ message: 'User deleted and logged out successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
