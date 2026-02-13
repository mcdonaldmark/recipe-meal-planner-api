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
  definitions: {
    User: {
      type: "object",
      properties: {
        firstName: { example: "John" },
        lastName: { example: "Doe" },
        email: { example: "john@example.com" },
        username: { example: "johndoe" },
        locale: { example: "en-US" }
      },
      required: ["firstName", "lastName", "email"]
    },
    Recipe: {
      type: "object",
      properties: {
        title: { example: "Spaghetti Bolognese" },
        description: { example: "Classic Italian pasta" },
        ingredients: { type: "array", items: { example: "Tomatoes" } },
        steps: { type: "array", items: { example: "Boil pasta" } },
        tags: { type: "array", items: { example: "tagId123" } },
        cookingTime: { example: 30 },
        difficulty: { example: "medium", enum: ["easy", "medium", "hard"] },
        servings: { example: 4 }
      },
      required: ["title", "ingredients", "steps"]
    },
    MealPlan: {
      type: "object",
      properties: {
        title: { example: "Weekly Plan" },
        description: { example: "My weekly meal plan" },
        recipeIds: { type: "array", items: { example: "recipeId123" } },
        mealType: { example: "lunch", enum: ["breakfast", "lunch", "dinner", "snack"] },
        startDate: { example: "2026-02-12" },
        endDate: { example: "2026-02-18" }
      },
      required: ["recipeIds", "mealType"]
    },
    Tag: {
      type: "object",
      properties: {
        name: { example: "Italian" },
        color: { example: "#FF0000" }
      },
      required: ["name"]
    }
  },
  paths: {
    // ------------------- USERS -------------------
    "/users": {
      post: {
        tags: ["Users"],
        description: "Create a new user (you must log in via Google)",
        consumes: ["application/json"],
        security: [{ googleOAuth: [] }],
        parameters: [{ name: "body", in: "body", required: true, schema: { $ref: "#/definitions/User" } }],
        responses: {
          201: { description: "User created successfully" },
          400: { description: "Bad Request" },
          401: { description: "Unauthorized" }
        }
      }
    },
    "/users/{id}": {
      put: {
        tags: ["Users"],
        description: "Update a user by ID (you must log in via Google)",
        consumes: ["application/json"],
        security: [{ googleOAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "body", in: "body", required: true, schema: { $ref: "#/definitions/User" } }
        ],
        responses: {
          200: { description: "User updated successfully" },
          400: { description: "Bad Request" },
          401: { description: "Unauthorized" },
          404: { description: "Not Found" }
        }
      }
    },

    // ------------------- RECIPES -------------------
    "/recipes": {
      post: {
        tags: ["Recipes"],
        description: "Create a new recipe (you must log in via Google)",
        consumes: ["application/json"],
        security: [{ googleOAuth: [] }],
        parameters: [{ name: "body", in: "body", required: true, schema: { $ref: "#/definitions/Recipe" } }],
        responses: {
          201: { description: "Recipe created successfully" },
          400: { description: "Bad Request" }
        }
      }
    },
    "/recipes/{id}": {
      put: {
        tags: ["Recipes"],
        description: "Update a recipe by ID (you must log in via Google)",
        consumes: ["application/json"],
        security: [{ googleOAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "body", in: "body", required: true, schema: { $ref: "#/definitions/Recipe" } }
        ],
        responses: {
          200: { description: "Recipe updated successfully" },
          400: { description: "Bad Request" },
          404: { description: "Not Found" }
        }
      }
    },

    // ------------------- MEALPLANS -------------------
    "/mealplans": {
      get: {
        tags: ["MealPlans"],
        description: "Get all meal plans (you must log in via Google)",
        security: [{ googleOAuth: [] }],
        responses: {
          200: { description: "OK" },
          401: { description: "Unauthorized" },
          500: { description: "Internal Server Error" }
        }
      },
      post: {
        tags: ["MealPlans"],
        description: "Create a new meal plan (you must log in via Google)",
        consumes: ["application/json"],
        security: [{ googleOAuth: [] }],
        parameters: [{ name: "body", in: "body", required: true, schema: { $ref: "#/definitions/MealPlan" } }],
        responses: {
          201: { description: "Created" },
          400: { description: "Bad Request" },
          401: { description: "Unauthorized" },
          500: { description: "Internal Server Error" }
        }
      }
    },
    "/mealplans/{id}": {
      put: {
        tags: ["MealPlans"],
        description: "Update a meal plan by ID (owner only, you must log in via Google)",
        consumes: ["application/json"],
        security: [{ googleOAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "body", in: "body", required: true, schema: { $ref: "#/definitions/MealPlan" } }
        ],
        responses: {
          200: { description: "OK" },
          400: { description: "Bad Request" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Not Found" },
          500: { description: "Internal Server Error" }
        }
      }
    },

    // ------------------- TAGS -------------------
    "/tags": {
      post: {
        tags: ["Tags"],
        description: "Create a new tag (you must log in via Google)",
        consumes: ["application/json"],
        security: [{ googleOAuth: [] }],
        parameters: [{ name: "body", in: "body", required: true, schema: { $ref: "#/definitions/Tag" } }],
        responses: {
          201: { description: "Created" },
          400: { description: "Bad Request" },
          401: { description: "Unauthorized" },
          500: { description: "Internal Server Error" }
        }
      }
    },
    "/tags/{id}": {
      put: {
        tags: ["Tags"],
        description: "Update a tag by ID (you must log in via Google)",
        consumes: ["application/json"],
        security: [{ googleOAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, type: "string" },
          { name: "body", in: "body", required: true, schema: { $ref: "#/definitions/Tag" } }
        ],
        responses: {
          200: { description: "OK" },
          400: { description: "Bad Request" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Not Found" },
          500: { description: "Internal Server Error" }
        }
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './routes/recipes.js',
  './routes/users.js',
  './routes/mealplan.js',
  './routes/tags.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON generated successfully!');
});
