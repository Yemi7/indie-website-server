const router = require("express").Router()
const Post = require("../models/Post.model")
// create post route
router.post("/", async (req, res, next) => {
  console.log(req.body)
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    //need to add relations to user and game
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
    const response = await Post.find({})
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
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// update a post
router.patch("/:postId", async (req, res, next) => {
  console.log(req.body)
  const { title, content } = req.body
  try {
    const upadtedPost = { title, content }
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

// delete a post
router.delete("/:postId", async (req, res, next) => {
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
