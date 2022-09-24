const Trouble = require("./Trouble");

module.exports = {
  // Auth Troubles
  EMAIL_ALREADY_TAKEN: new Trouble(
    422,
    "EMAIL_ALREADY_TAKEN",
    "Email is already taken. Please use another email."
  ),
  EMAIL_NOT_FOUND: new Trouble(
    404,
    "EMAIL_NOT_FOUND",
    "Email not found. Please pass email that exists."
  ),
  EMAIL_ALREADY_VERIFIED: new Trouble(
    422,
    "EMAIL_ALREADY_VERIFIED",
    "Email already verified."
  ),
  EMAIL_VERIFICATION_TOKEN_NOT_VALID: new Trouble(
    422,
    "EMAIL_VERIFICATION_TOKEN_NOT_VALID",
    "Email verification token is not valid. Try again."
  ),
  WRONG_PASSWORD: new Trouble(
    401,
    "WRONG_PASSWORD",
    "Wrong password. Please pass valid password."
  ),
  USER_NOT_FOUND: new Trouble(
    404,
    "USER_NOT_FOUND",
    "User not found. Maybe it's gone or something."
  ),
  TIME_CAPSULE_RELEASE_TIME_INVALID: new Trouble(
    422,
    "RELEASE_TIME_INVALID",
    "Release time must be on the future. Please pass valid release time."
  ),
  TIME_CAPSULE_INACTIVE: new Trouble(
    422,
    "TIME_CAPSULE_INACTIVE",
    "Cannot open time capsule before its release time. Please wait until it is released."
  ),
  TIME_CAPSULE_NOT_FOUND: new Trouble(
    404,
    "TIME_CAPSULE_NOT_FOUND",
    "Time capsule is not found. Please find existing time capsule."
  ),
  TIME_CAPSULE_ATTACHMENT_FILE_NOT_EXISTS: new Trouble(
    422,
    "TIME_CAPSULE_ATTACHMENT_FILE_NOT_EXISTS",
    "Attachment file does not exists. Please pass attachment file that exists."
  ),
  TIME_CAPSULE_MISMATCH_OWNER: new Trouble(
    403,
    "TIME_CAPSULE_MISMATCH_OWNER",
    "Time capsule is not owned by you. Please find your own time capsule."
  ),
  ACCESS_TOKEN_INVALID: new Trouble(
    401,
    "ACCESS_TOKEN_INVALID",
    "Access token is not valid. Please pass a valid access token"
  ),
  FILE_ALREADY_EXISTS: new Trouble(
    409,
    "FILE_ALREADY_EXISTS",
    "File already exists. Please upload another file."
  ),
  UNIMPLEMENTED: new Trouble(
    503,
    "UNIMPLEMENTED",
    "Service not implemented. Please comeback later."
  ),
  OUT_OF_RANGE: new Trouble(
    400,
    "OUT_OF_RANGE",
    "Page number is out of range. Please pass valid page number."
  ),
  BAD_REQUEST: new Trouble(
    400,
    "BAD_REQUEST",
    "Request parameter is not valid. Please pass valid request parameter based on the API Contract."
  ),
  ROUTE_NOT_FOUND: new Trouble(
    404,
    "ROUTE_NOT_FOUND",
    "Route not found. Please double check the method and path."
  ),
  INTERNAL_SERVER_ERROR: new Trouble(
    500,
    "INTERNAL_SERVER_ERROR",
    "Internal server error. Please report it to the back-end developer."
  ),
};
