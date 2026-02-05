const User = require('../models/User');

// Get all users (only allow admins or authenticated users)
exports.getAllUsers = async (req, res) => {
  try {
    // Optionally, you can filter so normal users only see themselves
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

// Update logged-in user (only allow self update)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // always update self
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true
    }).select('-googleId');
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete logged-in user or another user (admin or self)
exports.deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id; // delete the ID from params

    const user = await User.findById(userIdToDelete);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: only allow self or admin to delete
    if (userIdToDelete !== req.user.id) {
      // Add admin check here if needed
      return res.status(403).json({ message: 'Not allowed to delete this user' });
    }

    await User.findByIdAndDelete(userIdToDelete);

    // Do NOT log out the current session
    res.json({ message: `User ${userIdToDelete} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

