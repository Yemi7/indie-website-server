const router = require("express").Router()

// auth routes
const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

// game routes
const gameRouter = require("./game.routes")
router.use("/game", gameRouter)

// game routes
const postRouter = require("./post.routes")
router.use("/post", postRouter)

// game routes
const commentRouter = require("./comment.routes")
router.use("/comment", commentRouter)

// test
router.get("/example", async (req, res, next) => {
  try {
    res.send("api route working")
  } catch (error) {
    next(error)
  }
})

module.exports = router
