const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: "./upload/image",
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" 
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});

module.exports = uploadImage;
