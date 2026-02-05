const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect('/redirect'); // redirect after login
  }
);

router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Failed to authenticate' });
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/logout-redirect');
  });
});

// Optional route to get current user
router.get('/currentUser', (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  res.json(req.user);
});

module.exports = router;
