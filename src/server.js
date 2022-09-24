const express = require("express");
const path = require("path");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const injectDependency = require("./injectDependency");
const configureRoute = require("./configureRoute");
const config = require("./config");
const docs = require("./docs");

const PUBLIC_DIRECTORY = path.join(__dirname, "../public");
const app = express();

app.use(express.json());
app.use(
  logger(
    "[:date[iso]]  INFO  -- : :method :url :status :res[content-length] - :response-time ms"
  )
);

// Add swaggers
app.use("/docs", swaggerUi.serve);
app.get("/docs.swagger.json", (req, res) => res.status(200).json(docs));
app.get("/docs", swaggerUi.setup(docs));
app.use(express.static(PUBLIC_DIRECTORY));

const server = configureRoute(injectDependency(app));

module.exports = server;
