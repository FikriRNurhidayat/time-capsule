const multer = require("multer");
const path = require("path");
const UPLOAD_DIRECTORY = path.join(__dirname, "../../public/uploads");

const storage = multer.memoryStorage({});
const upload = multer({ storage });

module.exports = function useFormData(fn = (upload) => upload.single("file")) {
  return fn(upload);
};
