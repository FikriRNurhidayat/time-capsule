const errors = require("../errors");
const Trouble = require("../errors/Trouble");
const docs = require("../docs");
const { log } = require("../lib");
const { TYPE_STRING } = require("../consts");

class Controller {
  constructor({ paginationManager } = {}) {
    this.paginationManager = paginationManager;
  }

  buildReply(data, meta = undefined) {
    return {
      meta,
      ...data,
    };
  }

  onError(err, req, res, next) {
    if (err instanceof Trouble) {
      log.debug(err.message);
      res.status(err.code).json(err.toJSON());
      return;
    }

    log.error(err.message);
    log.debug(err.stack);

    const error = errors.INTERNAL_SERVER_ERROR;
    res.status(error.code).json(error.toJSON());
  }

  onLost(req, res) {
    const error = errors.ROUTE_NOT_FOUND;
    res.status(error.code).json(error.toJSON());
  }
}

module.exports = Controller;
