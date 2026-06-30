const { verifyToken } = require("../middleware/auth.middlewares")
const User = require("../models/User.model")
const Game = require("../models/Game.model")
const Comment = require("../models/Comment.model")
// routes for each user, like editing profile, looking at all their comments
const router = require("express").Router()

// get current user through token
router.get("/", verifyToken, async (req, res, next) => {
  try {
    console.log(req.payload._id)
    const response = await User.findById(req.payload._id)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// find all games made by user
router.get("/games", verifyToken, async (req, res, next) => {
  try {
    const response = await Game.find({
      user: req.payload._id,
    })
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// find all comments made by user
router.get("/comments", verifyToken, async (req, res, next) => {
  try {
    const response = await Comment.find({
      user: req.payload._id,
    })
    res.json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router
