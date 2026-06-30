const router = require("express").Router()
const { verifyToken } = require("../middleware/auth.middlewares")
const Post = require("../models/Post.model")
const Game = require("../models/Game.model")
const Comment = require("../models/Comment.model")
// create post route
router.post("/", verifyToken, async (req, res, next) => {
  console.log(req.body)
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    user: req.payload._id,
    game: req.body.game, // the user will be on a game details page when making the post, it's id can be sent from there as params.
  }
  try {
    //! use findOne to implement check for userId before creating their own post
    const response = await Post.create(newPost)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// lists posts made on a game
router.get("/:gameId/by-game", async (req, res, next) => {
  console.log(req.params)
  try {
    const response = await Post.find({
      game: req.params.gameId,
    }) // add game id check here
      .populate("game", "title cover engine")
      .populate("user", "username profilePic")
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// find post by id
router.get("/:postId", async (req, res, next) => {
  console.log(req.params)
  try {
    const response = await Post.findById(req.params.postId)
      .populate("game", "title cover engine")
      .populate("user", "username profilePic")
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// update a post
router.patch("/:postId", verifyToken, async (req, res, next) => {
  //! use findOne to implement check for userId before editing their own post

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

//! implement only an admin deleting posts
router.delete("/:postId", verifyToken, async (req, res, next) => {
  console.log(req.params)

  try {
    const commentDeletions = await Comment.deleteMany({
      post: req.params.postId,
    })
    const postDelete = await Post.findByIdAndDelete(req.params.postId)
    res.json(commentDeletions, postDelete)
    // const response = await Post.findByIdAndDelete(req.params.postId)
    // res.json(response)
  } catch (error) {
    next(error)
  }
})
/* 
possible routes,
  route that gets a list of posts in descending order of their created at time
*/

module.exports = router
