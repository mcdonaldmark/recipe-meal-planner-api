const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Recipe & Meal Planner API',
    description: 'API for recipes, users, meal plans, and tags'
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
    "/users": {},
    "/users/{id}": {},
    "/recipes": {},
    "/recipes/{id}": {},

    "/mealplans": {
      "get": {
        "tags": ["MealPlans"],
        "description": "Get all meal plans (you must log in via Google)",
        "security": [{ "googleOAuth": [] }],
        "responses": {
          "200": { "description": "OK" },
          "401": { "description": "Unauthorized" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "post": {
        "tags": ["MealPlans"],
        "description": "Create a new meal plan (you must log in via Google)",
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
                "title": { "example": "Weekly Plan" },
                "description": { "example": "My weekly meal plan" },
                "recipeIds": { 
                  "type": "array", 
                  "items": { "example": "64f8a0c1234567890abcdef" } 
                },
                "mealType": { 
                  "example": "lunch", 
                  "enum": ["breakfast", "lunch", "dinner", "snack"] 
                },
                "startDate": { "example": "2026-02-12" },
                "endDate": { "example": "2026-02-18" }
              },
              "required": ["recipeIds", "mealType"]
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

    "/mealplans/{id}": {
      "get": {
        "tags": ["MealPlans"],
        "description": "Get a meal plan by ID (you must log in via Google)",
        "security": [{ "googleOAuth": [] }],
        "parameters": [{ "name": "id", "in": "path", "required": true, "type": "string" }],
        "responses": {
          "200": { "description": "OK" },
          "401": { "description": "Unauthorized" },
          "404": { "description": "Not Found" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "put": {
        "tags": ["MealPlans"],
        "description": "Update a meal plan by ID (owner only, you must log in via Google)",
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
                "title": { "example": "Updated Plan" },
                "description": { "example": "Updated description" },
                "recipeIds": { 
                  "type": "array", 
                  "items": { "example": "64f8a0c1234567890abcdef" } 
                },
                "mealType": { 
                  "example": "dinner", 
                  "enum": ["breakfast", "lunch", "dinner", "snack"] 
                },
                "startDate": { "example": "2026-02-15" },
                "endDate": { "example": "2026-02-21" }
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
        "tags": ["MealPlans"],
        "description": "Delete a meal plan by ID (owner only, you must log in via Google)",
        "security": [{ "googleOAuth": [] }],
        "parameters": [{ "name": "id", "in": "path", "required": true, "type": "string" }],
        "responses": {
          "200": { "description": "Meal plan deleted successfully" },
          "401": { "description": "Unauthorized" },
          "403": { "description": "Forbidden" },
          "404": { "description": "Not Found" },
          "500": { "description": "Internal Server Error" }
        }
      }
    },

    "/tags": {
      "get": {
        "tags": ["Tags"],
        "description": "Get all tags (you must log in via Google)",
        "security": [{ "googleOAuth": [] }],
        "responses": {
          "200": { "description": "OK" },
          "401": { "description": "Unauthorized" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "post": {
        "tags": ["Tags"],
        "description": "Create a new tag (you must log in via Google)",
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
                "name": { "example": "Italian" },
                "color": { "example": "#FF0000" }
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
    "/tags/{id}": {
      "get": {
        "tags": ["Tags"],
        "description": "Get a tag by ID (you must log in via Google)",
        "security": [{ "googleOAuth": [] }],
        "parameters": [{ "name": "id", "in": "path", "required": true, "type": "string" }],
        "responses": {
          "200": { "description": "OK" },
          "401": { "description": "Unauthorized" },
          "404": { "description": "Not Found" },
          "500": { "description": "Internal Server Error" }
        }
      },
      "put": {
        "tags": ["Tags"],
        "description": "Update a tag by ID (you must log in via Google)",
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
                "name": { "example": "Updated Tag" },
                "color": { "example": "#00FF00" }
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
        "tags": ["Tags"],
        "description": "Delete a tag by ID (you must log in via Google)",
        "security": [{ "googleOAuth": [] }],
        "parameters": [{ "name": "id", "in": "path", "required": true, "type": "string" }],
        "responses": {
          "200": { "description": "Tag deleted successfully" },
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
  './routes/users.js',
  './routes/mealplans.js',
  './routes/tags.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON generated successfully!');
});
