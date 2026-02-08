const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // make sure this exports the Express app
const Recipe = require('../models/Recipe');

// Mock authentication middleware to bypass auth in tests
jest.mock('../middleware/auth', () => (req, res, next) => next());

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('GET /recipes endpoints', () => {
  it('should return an empty array when no recipes exist', async () => {
    const res = await request(app).get('/recipes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all recipes', async () => {
    const recipe = await Recipe.create({
      title: 'Test Recipe',
      ingredients: ['Ingredient 1'],
      steps: ['Step 1'],
      userId: new mongoose.Types.ObjectId(), // required field
    });

    const res = await request(app).get('/recipes');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Test Recipe');
  });

  it('should return a recipe by id', async () => {
    const recipe = await Recipe.create({
      title: 'Test Recipe',
      ingredients: ['Ingredient 1'],
      steps: ['Step 1'],
      userId: new mongoose.Types.ObjectId(),
    });

    const res = await request(app).get(`/recipes/${recipe._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test Recipe');
  });

  it('should return 404 if recipe id does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/recipes/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
