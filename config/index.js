const express = require("express")
const logger = require("morgan")
const cors = require("cors")

const config = async (app) => {
  // Allows express to trust reverse proxies when using deploy services
  app.set("trust proxy", 1)

  // Sets cors to only send information to specified origin port
  app.use(cors({ origin: [process.env.ORIGIN] }))

  // logs requests in dev enviroment using morgan
  app.use(logger("dev"))

  // parses the incoming JSON requests
  app.use(express.json())

  //parses income request bodies with URL encoded data
  app.use(express.urlencoded({ extended: false }))

  app.get("/", (req, res, next) => {
    res.json("Up and Running")
  })
}

module.exports = config