const router = require("express").Router()
const {
  verifyToken,
  verifyAdmin,
  verifyUser,
} = require("../middleware/auth.middlewares")
const Game = require("../models/Game.model")
const Post = require("../models/Post.model")
const { deletePostAndComments } = require("./post.routes")
// create a game
router.post("/", verifyToken, verifyUser, async (req, res, next) => {
  console.log(req.payload)
  const newGame = {
    title: req.body.title,
    startDate: req.body.startDate,
    expectedRelease: req.body.expectedRelease,
    engine: req.body.engine,
    genre: req.body.genre,
    images: req.body.images,
    cover: req.body.cover,
    description: req.body.description,
    user: req.payload._id,
  }
  try {
    const response = await Game.create(newGame)
    res.json(response)
    //! implement error message for when it fails
  } catch (error) {
    next(error)
  }
})

// get a list of games
router.get("/", async (req, res, next) => {
  try {
    const response = await Game.find(req.params).populate(
      "user",
      "username profilePic",
    )
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// get an individual game
router.get("/:gameId", async (req, res, next) => {
  console.log(req.params)
  try {
    const response = await Game.findById(req.params.gameId).populate(
      "user",
      "username profilePic",
    )
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// update an individual game
router.patch("/:gameId", verifyToken, async (req, res, next) => {
  console.log(req.params)

  // deconstructing the body
  const {
    title,
    startDate,
    expectedRelease,
    engine,
    genre,
    cover,
    images,
    description,
  } = req.body

  try {
    const gameToUpdate = await Game.findOne({
      _id: req.params.gameId,
      user: req.payload._id,
    })

    if (!gameToUpdate) {
      return res
        .status(403)
        .json({ errorMessage: "You are not allowed to update this game" })
    }

    const updatedGame = {
      title,
      startDate,
      expectedRelease,
      engine,
      // genre,
      cover,
      images,
      description,
    }

    const response = await Game.findByIdAndUpdate(
      req.params.gameId,
      updatedGame,
      { new: true },
    )

    res.json(response)
  } catch (error) {
    next(error)
  }
})

router.delete("/:gameId", verifyToken, verifyAdmin, async (req, res, next) => {
  console.log(req.params)
  try {
    const posts = await Post.find({ game: req.params.gameId })
    await Promise.all(posts.map((post) => deletePostAndComments(post._id)))

    const response = await Game.findByIdAndDelete(req.params.gameId)
    res.json(response)
  } catch (error) {
    next(error)
  }
})
/* 
possible routes,
  get all games by userId in payload, for devs to see
  a status change for relased, in development and cancelled games
*/

module.exports = router
