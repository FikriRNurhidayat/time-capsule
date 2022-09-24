const createServer = require("./createServer");
const configureRoute = require("./configureRoute");

module.exports = configureRoute(createServer());
