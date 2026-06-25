const router = require("express").Router()

//test
router.get("/test", async(req,res,next) => {
    try {
        res.send("auth route working")
    } catch (error) {
        next(error)
    }
})

module.exports = router
