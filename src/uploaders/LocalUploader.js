const path = require("path");
const fs = require("fs");
const Uploader = require("./Uploader");
const { FILE_ALREADY_EXISTS, UNIMPLEMENTED } = require("../errors");

class LocalUploader extends Uploader {
  constructor() {
    super();
    this.uploadDirectory = path.join(__dirname, "../../public/uploads");
  }

  toLocalURL(filename) {
    return path.join("/uploads", filename);
  }

  async upload({ filename, mimetype, buffer }) {
    const filepath = path.join(this.uploadDirectory, filename);
    if (fs.existsSync(filepath)) throw FILE_ALREADY_EXISTS;

    fs.writeFileSync(filepath, buffer);

    return this.toLocalURL(filename);
  }
}

module.exports = LocalUploader;
