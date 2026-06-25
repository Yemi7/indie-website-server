const router = require("express").Router()
const Game = require("../models/Game.model")

router.post("/", async (req, res, next) => {
  console.log(req.body)
  const newGame = {
    title: req.body.title,
    startDate: req.body.startDate,
    expectedRelease: req.body.expectedRelease,
    engine: req.body.engine,
    images: req.body.images,
  }
  try {
    const response = await Game.create(newGame)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router
