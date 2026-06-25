const router = require("express").Router()
const Comment = require("../models/Comment.model")

//create a comment
router.post("/", async (req, res, next) => {
  console.log(req.body)
  const newComment = {
    username: req.body.username,
    profilePic: req.body.profilePic,
    description: req.body.description,
    //need to add relations to user and game
  }
  try {
    const response = await Comment.create(newComment)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// list all comments
router.get("/", async (req, res, next) => {
  try {
    const response = await Comment.find({})
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// find comment by id
router.get("/:commentId", async (req, res, next) => {
  console.log(req.params)
  try {
    const response = await Comment.findById(req.params.commentId)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// update a comment
router.patch("/:commentId", async (req, res, next) => {
  console.log(req.body)
  const { username, profilePic, description } = req.body
  try {
    const upadtedComment = { username, profilePic, description }
    const response = await Comment.findByIdAndUpdate(
      req.params.commentId,
      upadtedComment,
      { new: true },
    )
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// delete a comment
router.delete("/:commentId", async (req, res, next) => {
  console.log(req.params)
  // need to implement deleting the comments being filtered out of a related dev and post
  try {
    const response = await Comment.findByIdAndDelete(req.params.commentId)
    res.json(response)
  } catch (error) {
    next(error)
  }
})
module.exports = router
