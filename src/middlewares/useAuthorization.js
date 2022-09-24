const errors = require("../errors");
const { log } = require("../lib");

module.exports = function useAuthorization({ tokenManager }) {
  return function authorize(req, res, next) {
    try {
      const authorization = req.headers.authorization;
      const token = authorization.replace("Bearer ", "");
      const payload = tokenManager.verifyToken(token);

      req.userId = payload.id;
      next();
    } catch (err) {
      log.debug(err.message);
      next(errors.ACCESS_TOKEN_INVALID);
    }
  };
};
