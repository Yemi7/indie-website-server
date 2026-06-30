const router = require("express").Router()

const uploader = require("../middleware/cloudinary.config")

router.post("/upload-one", uploader.single("image"), (req, res, next) => {
  if (!req.file) {
    res.status(400).json({
      errorMessage:
        "There was a problem uploading the image. Check image format and size",
    })
    return
  }

  res.json({ imageUrl: req.file.path })
})

router.post("/upload-many", uploader.array("images", 5), (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    res.status(400).json({
      errorMessage:
        "There was a problem uploading the images. Check image format and size.",
    })
    return
  }
  const imageUrls = req.files.map((file) => file.path)
  res.json({ imageUrls })
})

module.exports = router
