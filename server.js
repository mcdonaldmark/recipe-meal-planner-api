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

/**
 * CORS
 */
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

/**
 * Sessions
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB();

/**
 * ROUTES
 */
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/recipes', require('./routes/recipes'));

/**
 * CLEAN LOGIN ROUTE
 */
app.get('/login', (req, res) => {
  res.redirect('/auth/google');
});

/**
 * Root
 */
app.get('/', (req, res) => {
  res.send('Recipe & Meal Planner API is running');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
