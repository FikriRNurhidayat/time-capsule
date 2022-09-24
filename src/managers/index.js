const fs = require("fs");
const path = require("path");

fs.readdirSync(__dirname)
  .filter((filename) => filename !== "index.js")
  .forEach((filename) => {
    const module = path.parse(filename);
    const modulePath = path.join(__dirname, filename);

    exports[module.name] = require(modulePath);
  });
