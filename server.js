const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

require('./config/passport');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Session with MongoDB store to persist sessions in production
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true in prod, false in dev
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
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

app.get('/', (req, res) => {
  res.send('Recipe & Meal Planner API is running');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
