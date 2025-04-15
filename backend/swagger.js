// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gift Management API",
      version: "1.0.0",
      description: "API documentation for the Gift Management system",
    },
    servers: [
      {
        url: "http://localhost:3000", // change this if you deploy
      },
    ],
  },
  apis: ["./auth.js", "./events.js ", "./gift.js"], // path to your route files
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
