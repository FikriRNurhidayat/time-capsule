const multer = require("multer");

const storage = multer.memoryStorage({});
const upload = multer({ storage });

module.exports = function useFormData(fn = (upload) => upload.single("file")) {
  return fn(upload);
};
