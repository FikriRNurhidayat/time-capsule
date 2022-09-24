const path = require("path");

module.exports = {
  TYPE_BOOLEAN: "boolean",
  TYPE_STRING: "string",
  TYPE_FUNCTION: "function",
  PUBLIC_DIRECTORY: path.join(__dirname, "../public"),
  UPLOAD_DIRECTORY: path.join(__dirname, "../public/uploads"),
  TIME_CAPSULE_EMAIL_VERIFICATION_SUBJECT: "Verify your email, please!",
  LOG_FORMAT:
    "[:date[iso]]  INFO  -- : :method :url :status :res[content-length] - :response-time ms",
};
