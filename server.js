process.loadEnvFile()

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

/* 
Crud operations
. Get a list of games, populated with it's dev
. Get an individual game, populated with posts and its dev
. Create a game with relation to it's dev 
. Edit a games details based on the dev verification
. Get an indiviual post with its data(content)
. Create a post with relation to it's game based on the user verifcation
. Edit a posts details based on the user verification (needs to get the "data" "content")
. Create a comment related to it's post and it's user
. Edit a comment related to it's post and based on it's user verification
. Create a user (signup)
. Login with a user (login)
. Change a user role to dev


*/
