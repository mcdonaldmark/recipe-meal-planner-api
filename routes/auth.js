const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect('/auth/redirect');
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

router.get('/redirect', (req, res) => {
  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=/api-docs" />
      </head>
      <body>
        <h2>Login successful!</h2>
        <p>If you are not redirected automatically, <a href="/api-docs">click here</a>.</p>
      </body>
    </html>
  `);
});

router.get('/logout-redirect', (req, res) => {
  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="3;url=/api-docs" />
      </head>
      <body>
        <h2>Logged out successfully!</h2>
        <p>You will be redirected to the API docs in 3 seconds...</p>
        <p>If not redirected, <a href="/api-docs">click here</a>.</p>
      </body>
    </html>
  `);
});

module.exports = router;
