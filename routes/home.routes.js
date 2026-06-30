// routes on the home page
const router = require("express").Router()
const { verifyToken } = require("../middleware/auth.middlewares")
const Game = require("../models/Game.model")
const Post = require("../models/Post.model")

// find a list of games with a descending created at
router.get("/games", async (req, res, next) => {
  try {
    const response = await Game.find({}).sort({ createdAt: -1 })
    res.json(response)
  } catch (error) {
    next(error)
  }
})
router.get("/posts", async (req, res, next) => {
  try {
    const response = await Post.find({}).sort({ createdAt: -1 })
    res.json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router
