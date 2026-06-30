const cloudinary = require("cloudinary").v2
const multer = require("multer")
const {
  cloudinaryStorage,
  CloudinaryStorage,
} = require("multer-storage-cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png"],
    folder: "my-app",
  },
})

module.exports = multer({ storage })
