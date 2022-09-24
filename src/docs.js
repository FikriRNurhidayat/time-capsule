const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Time Capsule",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            code: {
              type: "integer",
              example: 500,
            },
            reason: {
              type: "string",
              example: "INTERNAL_SERVER_ERROR",
            },
            message: {
              type: "string",
              example:
                "Internal server error. Please report it to the back-end developer.",
            },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.js"],
};

module.exports = swaggerJsdoc(options);
