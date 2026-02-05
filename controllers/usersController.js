const User = require('../models/User');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not logged in' });
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

    const users = await User.find().select('-googleId');
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

// Create a new user (optional, mainly for testing)
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a user (self or admin)
exports.updateUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not logged in' });

    const userIdToUpdate = req.params.id;

    // Only allow self or admin to update
    if (req.user.id !== userIdToUpdate && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not allowed to update this user' });
    }

    const updatedUser = await User.findByIdAndUpdate(userIdToUpdate, req.body, {
      new: true
    }).select('-googleId');

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a user (self or admin) — logged-in user remains logged in
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not logged in' });

    const userIdToDelete = req.params.id;

    // Only allow self or admin
    if (req.user.id !== userIdToDelete && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not allowed to delete this user' });
    }

    const user = await User.findById(userIdToDelete);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(userIdToDelete);

    res.json({
      message: `User ${userIdToDelete} deleted successfully`,
      note: 'Your session remains active'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
