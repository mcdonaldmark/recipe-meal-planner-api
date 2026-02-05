const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // updated import for v4+

require('./config/passport');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1); // for secure cookies behind proxies

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Connect to MongoDB first
connectDB();

// Session middleware with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // your MongoDB URI
      ttl: 14 * 24 * 60 * 60, // 14 days
      autoRemove: 'native', // let MongoDB handle expired sessions
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // only use HTTPS in production
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

// Login redirect
app.get('/login', (req, res) => {
  res.redirect('/auth/google');
});

// Post-login redirect
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

// Logout redirect
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

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/logout-redirect');
  });
});

// Health check
app.get('/', (req, res) => {
  res.send('Recipe & Meal Planner API is running');
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
