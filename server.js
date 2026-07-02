try {
  process.loadEnvFile()
} catch(error) {
  console.warn(".env file not found, using default environment values")
}

//app imports express
const express = require("express")
const app = express()

//config middleware
const config = require("./config")
config(app)

//connection to the database
const connectDB = require("./db")
app.use(async (req, res, next) => {
  await connectDB()
  next()
})

// highest level route
app.get("/", (req, res, next) => {
  res.json("Up and running")
})

// routes
const indexRouter = require("./routes/index.routes")
app.use("/api", indexRouter)

// error handling
const errorHandler = require("./errors")
errorHandler(app)

// server listener
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})


