const express = require('express');
const cors = require('cors');
require('dotenv').config();

const passport = require('passport');
const session = require('express-session');

require('./config/passport');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

// ---- REMOVE connectDB() from here ----
// We'll call it only in real server mode

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: false,
      sameSite: 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/auth', require('./routes/auth'));
console.log('✔️ Auth routes loaded');

app.use('/users', require('./routes/users'));
console.log('✔️ Users routes loaded');

app.use('/recipes', require('./routes/recipes'));
console.log('✔️ Recipes routes loaded');

// Auth redirect routes
app.get('/login', (req, res) => {
  res.redirect('/auth/google');
});

app.get('/redirect', (req, res) => {
  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="3;url=/api-docs" />
      </head>
      <body>
        <h2>Login successful!</h2>
        <p>You will be redirected to the API docs in 3 seconds...</p>
        <p>If not redirected, <a href="/api-docs">click here</a>.</p>
      </body>
    </html>
  `);
});

app.get('/logout-redirect', (req, res) => {
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

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/logout-redirect');
  });
});

// Base route
app.get('/', (req, res) => {
  res.send('Recipe & Meal Planner API is running');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Start server only if not in test mode ---
if (process.env.NODE_ENV !== 'test') {
  const connectDB = require('./data/database');
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}

// Export app for testing
module.exports = app;
