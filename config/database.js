const log = require("../src/lib/log");
const {
  DATABASE_USERNAME = null,
  DATABASE_PASSWORD = null,
  DATABASE_NAME = "timecapsule_development",
  DATABASE_HOST = "127.0.0.1",
} = process.env;

function queryLogger(sql) {
  log.debug(sql);
}

module.exports = {
  development: {
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: "127.0.0.1",
    dialect: "postgres",
    logging: queryLogger,
  },
  test: {
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: `${DATABASE_NAME}_test`,
    host: DATABASE_HOST,
    dialect: "postgres",
    logging: queryLogger,
  },
  production: {
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    dialect: "postgres",
    logging: queryLogger,
  },
};
