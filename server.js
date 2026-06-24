process.loadEnvFile()

const express = require("express")
const logger = require("morgan")
const cors = require("cors")

const app = express()

//connection to the database
const mongoose = require("mongoose")

const connectDB = async () => {
  //stop duplicate connection problems on some hosting services
  if (mongoose.connection.readyState === 1) {
    return
  }

  try {
    const response = await mongoose.connect(process.env.MONGO_URI)
    const dbName = response.connections[0].name
    console.log(`Connected to mongo! Database name: "${dbName}"`)
  } catch (error) {
    console.error("Error connecting to mongo:", error)
  }
}

app.use(async (req, res, next) => {
  await connectDB()
  next()
})

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

// server listener
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
