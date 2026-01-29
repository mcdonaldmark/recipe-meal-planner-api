const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./data/database');
const passport = require('passport');
const session = require('express-session');

require('./config/passport');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

// IMPORTANT for Render HTTPS
app.set('trust proxy', 1);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none'
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to DB
connectDB();

// Routes
app.use('/auth', require('./routes/auth'));
console.log('✔️ Auth routes loaded');

app.use('/users', require('./routes/users'));
console.log('✔️ Users routes loaded');

app.use('/recipes', require('./routes/recipes'));
console.log('✔️ Recipes routes loaded');

// Clean login route
app.get('/login', (req, res) => {
  res.redirect('/auth/google');
});

// Root route
app.get('/', (req, res) => {
  res.send('Recipe & Meal Planner API is running');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
