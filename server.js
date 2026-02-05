const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const connectDB = require('./data/database');

require('./config/passport');

const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');
const authRouter = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// MongoDB connection
connectDB();

// Sessions stored in MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);

// Default route
app.get('/', (req, res) => res.send('API running'));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.listen(port, () => console.log(`Server running on port ${port}`));
