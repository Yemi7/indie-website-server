const router = require("express").Router()
const { verifyToken } = require("../middleware/auth.middlewares")
const Post = require("../models/Post.model")
const Game = require("../models/Game.model")
// create post route
router.post("/", verifyToken, async (req, res, next) => {
  console.log(req.body)
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    user: req.payload._id,
    game: req.body.game, // the user will be on a game details page when making the post, it's id can be sent from there
  }
  try {
    const response = await Post.create(newPost)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// list all posts
router.get("/", async (req, res, next) => {
  try {
    const response = await Post.find(req.params).populate("game")
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// find post by id
router.get("/:postId", async (req, res, next) => {
  console.log(req.params)
  try {
    const response = await Post.findById(req.params.postId).populate("game")
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// update a post
router.patch("/:postId", verifyToken, async (req, res, next) => {
  console.log(req.body)
  const { title, content, user, game } = req.body
  try {
    const upadtedPost = { title, content, user, game }
    const response = await Post.findByIdAndUpdate(
      req.params.postId,
      upadtedPost,
      { new: true },
    )
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// delete a post, only to be done in rare cases
router.delete("/:postId", verifyToken, async (req, res, next) => {
  console.log(req.params)
  // need to implement deleting the post being filtered out of a related dev and game
  try {
    const response = await Post.findByIdAndDelete(req.params.postId)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router
