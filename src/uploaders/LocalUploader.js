const { log } = require("../lib");
const path = require("path");
const fs = require("fs");
const Uploader = require("./Uploader");
const { TIME_CAPSULE_BASE_URL } = require("../config");
const { UPLOAD_DIRECTORY } = require("../consts");
const { FILE_ALREADY_EXISTS, UNIMPLEMENTED } = require("../errors");

class LocalUploader extends Uploader {
  constructor() {
    super();
    this.uploadDirectory = UPLOAD_DIRECTORY;
  }

  toLocalURL(filename) {
    return TIME_CAPSULE_BASE_URL + path.join("/uploads", filename);
  }

  upload = async ({ filename, mimetype, buffer }) => {
    const filepath = path.join(this.uploadDirectory, filename);

    if (fs.existsSync(filepath)) throw FILE_ALREADY_EXISTS;

    fs.writeFileSync(filepath, buffer);

    return this.toLocalURL(filename);
  };
}

module.exports = LocalUploader;
