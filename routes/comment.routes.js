const router = require("express").Router()
const { verifyToken } = require("../middleware/auth.middlewares")
const Comment = require("../models/Comment.model")

//create a comment
router.post("/", verifyToken, async (req, res, next) => {
  console.log(req.body)
  const newComment = {
    username: req.body.username,
    profilePic: req.body.profilePic,
    description: req.body.description,
    user: req.payload._id,
    post: req.body.post, //will be on a post details page that contains the id of the post
  }
  try {
    const response = await Comment.create(newComment)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// list comments on a specific post
router.get("/:postId/by-post", async (req, res, next) => {
  try {
    const response = await Comment.find({
      post: req.params.postId,
    })
      .populate("post", "title")
      .populate("user", "username profilePic")
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// update a comment
router.patch("/:commentId", verifyToken, async (req, res, next) => {
  console.log(req.body)
  const { username, profilePic, description, user, post } = req.body

  try {
    const commentToUpdate = await Comment.findOne({
      _id: req.params.commentId,
      user: req.payload._id,
    })

    if (!commentToUpdate) {
      return res
        .status(403)
        .json({ errorMessage: "You are not allowed to update this comment" })
    }

    const updatedComment = { username, profilePic, description, user, post }
    const response = await Comment.findByIdAndUpdate(
      req.params.commentId,
      updatedComment,
      { new: true },
    )
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// delete a comment
router.delete("/:commentId", verifyToken, async (req, res, next) => {
  console.log(req.params)
  const isAdmin = req.payload.role === "admin"
  const adminBypass = isAdmin
    ? { _id: req.params.commentId }
    : { _id: req.params.commentId, user: req.payload._id }
  try {
    const commentToDelete = await Comment.findOne(adminBypass) // now if the user is an admin, the findOne won't check for the users id when looking for a comment

    if (!commentToDelete) {
      return res
        .status(403)
        .json({ errorMessage: "You are not allowed to delete this comment" })
    }

    const response = await Comment.findByIdAndDelete(req.params.commentId)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router
