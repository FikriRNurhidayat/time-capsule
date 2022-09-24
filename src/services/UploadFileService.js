const path = require("path");
const { File } = require("../models");

class UploadFileService {
  constructor({ uploader, fileRepository }) {
    this.uploader = uploader;
    this.fileRepository = fileRepository;
  }

  formatFileName(originalname) {
    const ext = path.extname(originalname);
    const timestamp = Date.now();

    return timestamp + ext;
  }

  async call({ originalname, mimetype, buffer }) {
    const name = this.formatFileName(originalname);

    const uploadedFileURL = await this.uploader.upload({
      filename: this.formatFileName(originalname),
      mimetype,
      buffer,
    });

    const file = new File({
      name: name,
      url: uploadedFileURL,
    });

    await this.fileRepository.save(file);

    return { file };
  }
}

module.exports = UploadFileService;
