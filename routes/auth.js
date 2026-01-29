const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * LOGIN ROUTE (clean URL)
 * https://recipe-meal-planner-api-nooc.onrender.com/login
 */
router.get(
  '/login',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

/**
 * GOOGLE CALLBACK (DO NOT VISIT DIRECTLY)
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.json({
      message: 'Logged in successfully',
      user: req.user
    });
  }
);

router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Failed to authenticate' });
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

router.get('/currentUser', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.user);
});

module.exports = router;
