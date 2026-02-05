const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect('/auth/redirect'); // redirect after login
  }
);

router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Failed to authenticate' });
});

// Optional logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

// Redirect page for front-end
router.get('/redirect', (req, res) => {
  res.json({ message: 'Login successful', user: req.user });
});

module.exports = router;
