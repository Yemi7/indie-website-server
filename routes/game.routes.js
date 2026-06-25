const router = require("express").Router()
const Game = require("../models/Game.model")
// create a game
router.post("/", async (req, res, next) => {
  console.log(req.body)
  const newGame = {
    title: req.body.title,
    startDate: req.body.startDate,
    expectedRelease: req.body.expectedRelease,
    engine: req.body.engine,
    images: req.body.images,
    cover: req.body.cover,
  }
  try {
    const response = await Game.create(newGame)
    res.json(response)
    // implement error message for
    // implement adding a relation to it's user once user routes are created
  } catch (error) {
    next(error)
  }
})

// get a list of games
router.get("/", async (req, res, next) => {
  try {
    const response = await Game.find({})
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// get an individual game
router.get("/:gameId", async (req, res, next) => {
  console.log(req.params)
  try {
    const response = await Game.findById(req.params.gameId)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// update an individual game
router.patch("/:gameId", async (req, res, next) => {
  console.log(req.params)
  // deconstructing the body
  const { title, startDate, expectedRelease, engine, cover, images } = req.body

  try {
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

// delete a game
router.delete("/:gameId", async (req, res, next) => {
  console.log(req.params)
  // need to implement deleting the gameId being filtered out of a related dev
  try {
    const response = await Game.findByIdAndDelete(req.params.gameId)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router
