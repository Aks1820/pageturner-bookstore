const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary.config");

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "pageturner",

    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// Upload middleware
const upload = multer({ storage });

module.exports = upload;
