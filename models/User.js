const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String },
    locale: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
