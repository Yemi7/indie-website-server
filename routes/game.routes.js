const router = require("express").Router()
const { verifyToken } = require("../middleware/auth.middlewares")
const Game = require("../models/Game.model")
const Post = require("../models/Post.model")
// create a game
router.post("/", verifyToken, async (req, res, next) => {
  console.log(req.payload)
  const newGame = {
    title: req.body.title,
    startDate: req.body.startDate,
    expectedRelease: req.body.expectedRelease,
    engine: req.body.engine,
    images: req.body.images,
    cover: req.body.cover,
    user: req.payload._id,
  }
  try {
    //! implement security check so only a user can create a game
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
  //! use findOne to implement check for userId before updating their own game

  // deconstructing the body
  const { title, startDate, expectedRelease, engine, cover, images } = req.body

  try {
    // implement security check so only the user can update a game

    const updatedGame = {
      title,
      startDate,
      expectedRelease,
      engine,
      cover,
      images,
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
  // implementation for verifyToken and verifyDev needs to be added
})

//! implement only an admin being able to delete a game
router.delete("/:gameId", verifyToken, async (req, res, next) => {
  console.log(req.params)
  try {
    const postDeletions = await Post.deleteMany({
      game: req.params.gameId,
    })
    const gameDelete = await Game.findByIdAndDelete(req.params.gameId)
    res.json(postDeletions, gameDelete)
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
