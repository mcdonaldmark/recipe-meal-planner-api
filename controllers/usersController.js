const User = require('../models/User');

// Get all users (authenticated)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-googleId'); // hide googleId
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

// Create a new user (optional if using Google OAuth)
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'You must be logged in' });

    const targetUserId = req.params.id;

    // If Google OAuth user, skip ownership check
    if (!req.user.googleId && req.user.id !== targetUserId) {
      return res.status(403).json({ message: 'Not allowed to update this user' });
    }

    const updatedUser = await User.findByIdAndUpdate(targetUserId, req.body, {
      new: true,
    }).select('-googleId');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'You must be logged in' });

    const targetUserId = req.params.id;
    const user = await User.findById(targetUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If normal user, check ownership
    if (!req.user.googleId && req.user.id !== targetUserId) {
      return res.status(403).json({ message: 'Not allowed to delete this user' });
    }

    await User.findByIdAndDelete(targetUserId);

    res.json({
      message: `User ${user.firstName} ${user.lastName} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
