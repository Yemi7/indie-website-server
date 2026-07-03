const router = require("express").Router()
const { verifyToken, verifyAdmin } = require("../middleware/auth.middlewares")
const Post = require("../models/Post.model")
const Game = require("../models/Game.model")
const Comment = require("../models/Comment.model")
// create post route
router.post("/", verifyToken, async (req, res, next) => {
  if (!req.body.title) {
    return res
      .status(400)
      .json({ message: "Please enter a title for your post." })
  }
  console.log(req.body)
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    user: req.payload._id,
    game: req.body.game, // the user will be on a game details page when making the post, it's id can be sent from there as params.
  }
  try {
    const findgame = await Game.findOne({
      _id: req.body.game,
      user: req.payload._id,
    })
    console.log(req.body.game)

    if (!findgame) {
      return res.status(403).json({
        errorMessage: "You are not allowed to create a post for this game",
      })
    }

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
      .populate("game", "title cover engine genre")
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
      .populate("game", "title cover engine genre")
      .populate("user", "username profilePic")
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
    const postToUpdate = await Post.findOne({
      _id: req.params.postId,
      user: req.payload._id,
    })

    if (!postToUpdate) {
      return res
        .status(403)
        .json({ errorMessage: "You are not allowed to update this post" })
    }

    const updatedPost = { title, content, user, game }
    const response = await Post.findByIdAndUpdate(
      req.params.postId,
      updatedPost,
      { new: true },
    )
    res.json(response)
  } catch (error) {
    next(error)
  }
})

const deletePostAndComments = async (postId) => {
  await Comment.deleteMany({ post: postId })
  return await Post.findByIdAndDelete(postId)
}

router.delete("/:postId", verifyToken, verifyAdmin, async (req, res, next) => {
  console.log(req.params)

  try {
    const response = await deletePostAndComments(req.params.postId)
    res.json(response)
  } catch (error) {
    next(error)
  }
})
/* 
possible routes,
  route that gets a list of posts in descending order of their created at time
*/

module.exports = router
module.exports.deletePostAndComments = deletePostAndComments
