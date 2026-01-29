const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Recipe & Meal Planner API',
    description: 'API for recipes and users'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  basePath: '/',          // IMPORTANT
};

const outputFile = './swagger.json';

/*
  Scan ONLY the routes we want,
  but manually define their base paths
*/
const endpointsFiles = [
  './routes/recipes.js',
  './routes/users.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON generated successfully!');
});
