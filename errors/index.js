function handleErrors(app) {
  // Handles requests not found, the last route reached when nothing is found
  app.use((req, res, next) => {
    res.status(404).json({ message: "This route doesn't exist" })
  })
  // Dedicated error handling route
  app.use((err, req, res, next) => {
    //logs error
    console.error("ERROR", req.method, req.path, err)
    // prevents double response which will always crash the server
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Internal server error. Check the console" })
    }
  })
}

module.exports = handleErrors
