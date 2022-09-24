const { UNIMPLEMENTED } = require("../errors");

class Uploader {
  upload({ filename, mimetype, buffer }) {
    throw UNIMPLEMENTED;
  }
}

module.exports = Uploader;
