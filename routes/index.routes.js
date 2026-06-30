const router = require("express").Router()

// auth routes
const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

// game routes
const gameRouter = require("./game.routes")
router.use("/game", gameRouter)

// post routes
const postRouter = require("./post.routes")
router.use("/post", postRouter)

// comment routes
const commentRouter = require("./comment.routes")
router.use("/comment", commentRouter)

// image upload routes
const uploadRoutes = require("./upload.routes")
router.use("/upload", uploadRoutes)

// user routes
const userRoutes = require("./user.routes")
router.use("/user", userRoutes)

// home routes
const homeRoutes = require("./home.routes")
router.use("/home", homeRoutes)

// test
router.get("/example", async (req, res, next) => {
  try {
    res.send("api route working")
  } catch (error) {
    next(error)
  }
})

module.exports = router
