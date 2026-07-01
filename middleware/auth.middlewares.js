const jwt = require("jsonwebtoken")
// Checks if the token is a valid token
function verifyToken(req, res, next) {
  console.log(req.headers)
  try {
    const authToken = req.headers.authorization.split(" ")[1]
    const payload = jwt.verify(authToken, process.env.TOKEN_SECRET)
    req.payload = payload

    next()
  } catch (error) {
    next(error)
  }
}
// Checks if the token of the user has a dev role
function verifyUser(req, res, next) {
  if (req.payload.role === "user") {
    next() //if the role of the user is "dev" the user can continue to the route
  } else {
    res.status(401).json({ errorMessage: "You're not a user" })
  }
}
function verifyAdmin(req, res, next) {
  if (req.payload.role === "admin") {
    next() //if the role of the user is "admin" the user can continue to the route
  } else {
    res.status(401).json({ errorMessage: "You're not an admin" })
  }
}

module.exports = { verifyToken, verifyAdmin, verifyUser }
