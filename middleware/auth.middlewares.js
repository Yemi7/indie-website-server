const jwt = require("jsonwebtoken")
// Checks if the token is a valid token
function verifyToken(req, res, next) {
  console.log(req.headers)
  try {
    const authToken = req.headers.authorization.split(" ")[1]
    const payload = jwt.verify(authToken, process.env.TOKEN_SECRET)
    req.payload = payload
    console.log(payload)
    res.status(200).send(payload)
  } catch (error) {
    next(error)
  }
}
// Checks if the token of the user has a dev role
function verifyDev(req, res, next) {
  if (req.payload.role === "dev") {
    next() //if the role of the user is "dev" the user can continue to the route
  } else {
    res.status(401).json({ errorMessage: "You're not a dev" })
  }
}
function verifyAdmin(req, res, next) {
  if (req.payload.role === "admin") {
    next() //if the role of the user is "admin" the user can continue to the route
  } else {
    res.status(401).json({ errorMessage: "You're not an admin" })
  }
}

module.exports = { verifyToken, verifyAdmin, verifyDev }
