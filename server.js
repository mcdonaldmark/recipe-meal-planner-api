const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Recipe & Meal Planner API',
    description: 'API for recipes and users'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  basePath: '/',
  securityDefinitions: {
    googleOAuth: {
      type: 'oauth2',
      authorizationUrl: 'http://localhost:3000/auth/google',
      flow: 'implicit',
      scopes: {}
    }
  },
  paths: {
    // Users endpoints
    "/users": {
      "get": {
        "tags": ["Users"],
        "description": "Get all users (requires Google OAuth authentication)",
        "security": [{ "googleOAuth": [] }],
        "responses": {
          "200": { "description": "OK" },
          "401": { "description": "Unauthorized" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "post": {
        "tags": ["Users"],
        "description": "Create a new user (requires authentication, usually Google OAuth)",
        "consumes": ["application/json"],
        "security": [{ "googleOAuth": [] }],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "firstName": { "example": "Mark" },
                "lastName": { "example": "McDonald" },
                "email": { "example": "mark@example.com" },
                "username": { "example": "markm" },
                "password": { "example": "Password123" }
              }
            }
          }
        ],
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Bad Request" },
          "401": { "description": "Unauthorized" }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "tags": ["Users"],
        "description": "Get a user by ID (requires authentication)",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "type": "string" }
        ],
        "security": [{ "googleOAuth": [] }],
        "responses": {
          "200": { "description": "OK" },
          "401": { "description": "Unauthorized" },
          "404": { "description": "Not Found" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "put": {
        "tags": ["Users"],
        "description": "Update a user by ID (self only for normal users, unrestricted for Google OAuth users)",
        "consumes": ["application/json"],
        "security": [{ "googleOAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "type": "string" },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "firstName": { "example": "Mark" },
                "lastName": { "example": "McDonald" },
                "email": { "example": "mark@example.com" },
                "username": { "example": "markm" },
                "locale": { "example": "en-US" }
              }
            }
          }
        ],
        "responses": {
          "200": { "description": "User updated successfully" },
          "400": { "description": "Bad Request" },
          "401": { "description": "Unauthorized" },
          "403": { "description": "Forbidden - normal users can only update themselves; Google OAuth users can update any user" },
          "404": { "description": "Not Found" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "delete": {
        "tags": ["Users"],
        "description": "Delete a user by ID (self only for normal users, unrestricted for Google OAuth users)",
        "security": [{ "googleOAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "type": "string" }
        ],
        "responses": {
          "200": { "description": "User deleted successfully" },
          "401": { "description": "Unauthorized" },
          "403": { "description": "Forbidden - normal users can only delete themselves; Google OAuth users can delete any user" },
          "404": { "description": "Not Found" },
          "500": { "description": "Internal Server Error" }
        }
      }
    },
    // Recipes endpoints
    "/recipes": {
      "get": {
        "tags": ["Recipes"],
        "description": "Get all recipes (public access)",
        "responses": {
          "200": { "description": "OK" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "post": {
        "tags": ["Recipes"],
        "description": "Create a new recipe (requires authentication)",
        "consumes": ["application/json"],
        "security": [{ "googleOAuth": [] }],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "title": { "example": "Spaghetti" },
                "description": { "example": "Classic pasta dish" },
                "ingredients": { "type": "array", "items": { "example": "Pasta" } },
                "steps": { "type": "array", "items": { "example": "Boil water" } },
                "tags": { "type": "array", "items": { "example": "Italian" } }
              }
            }
          }
        ],
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Bad Request" },
          "401": { "description": "Unauthorized" },
          "500": { "description": "Internal Server Error" }
        }
      }
    },
    "/recipes/{id}": {
      "get": {
        "tags": ["Recipes"],
        "description": "Get a recipe by ID (public access)",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "type": "string" }
        ],
        "responses": {
          "200": { "description": "OK" },
          "404": { "description": "Not Found" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "put": {
        "tags": ["Recipes"],
        "description": "Update a recipe by ID (owner only, requires authentication)",
        "consumes": ["application/json"],
        "security": [{ "googleOAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "type": "string" },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "title": { "example": "Updated Recipe Title" },
                "description": { "example": "Updated description" },
                "ingredients": { "type": "array", "items": { "example": "Ingredient 1" } },
                "steps": { "type": "array", "items": { "example": "Step 1" } },
                "tags": { "type": "array", "items": { "example": "Italian" } }
              }
            }
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad Request" },
          "401": { "description": "Unauthorized" },
          "403": { "description": "Forbidden" },
          "404": { "description": "Not Found" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "delete": {
        "tags": ["Recipes"],
        "description": "Delete a recipe by ID (owner only, requires authentication)",
        "security": [{ "googleOAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "type": "string" }
        ],
        "responses": {
          "200": { "description": "Recipe deleted successfully" },
          "401": { "description": "Unauthorized" },
          "403": { "description": "Forbidden" },
          "404": { "description": "Not Found" },
          "500": { "description": "Internal Server Error" }
        }
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './routes/recipes.js',
  './routes/users.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON generated successfully!');
});
