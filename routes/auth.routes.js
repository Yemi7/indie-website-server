const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { verifyToken } = require("../middleware/auth.middlewares")
const uploader = require("../middleware/cloudinary.config")

// signup route
router.post("/signup", async (req, res, next) => {
  console.log(req.body)
  const { email, username, password } = req.body
  // Additional guard against user not entering either email, username or password
  if (!email || !password || !username) {
    res
      .status(400)
      .json({ message: "Please enter your email, password and username" })
  }
  // Guard and check to see if the email follows the format of a real email
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/gm

  if (emailRegex.test(email) === false) {
    res.status(400).json({ message: "Please enter a real email" })
    return
  }

  // Guard and check to see if the password meets the strength requirements we specified
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
  if (passwordRegex.test(password) === false) {
    res.status(400).json({
      message:
        "Please enter a stronger password. Requirements: 8 charaters, one uppercase and one lowercase character",
    })
    return
  }

  // Guard and check to see if the username meets our specified requirements
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9-_]{3,32}$/gi
  if (usernameRegex.test(username) === false) {
    res.status(400).json({
      message:
        "Please enter a valid username, only Alphanumeric characters and underscores",
    })
    return
  }
  // Hashes password to ensure the database holder can't see the password
  const hashPassword = await bcrypt.hash(password, 12)

  // User information to post for signup
  const newUser = {
    email,
    username,
    password: hashPassword,
  }

  try {
    const foundUserEmail = await User.findOne({ email: email })
    if (foundUserEmail) {
      res.status(400).json({
        message: "Sorry, a user has already registered with that email",
      })
      return
    }
    const foundUserUsername = await User.findOne({ username: username })
    if (foundUserUsername) {
      res
        .status(400)
        .json({ message: "Username already taken, please choose another one" })
      return
    }
    await User.create(newUser)
    res.status(201).json({ message: "New User Created" })
  } catch (error) {
    next(error)
  }
})

// login route
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body
  // Guard and check to see if email and passwords were both entered
  if (!email || !password) {
    res.status(400).json({ message: "Please enter both email and password" })
    return
  }
  // Guard and check to see if the email follows the format of a real email
  // Avoids sending uneeded requests to the DB when an incorrect email won't be found anyway
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/gm

  if (emailRegex.test(email) === false) {
    res.status(400).json({ message: "Please enter a real email" })
    return
  }

  try {
    // check to see if the email exists in our database
    const foundUser = await User.findOne({ email })
    // if no user is found it sends the error and returns, else it continues
    if (!foundUser) {
      res.status(400).json({ message: "No user has signed up with that email" })
      return
    }

    // check if the foundUsers password matches the hashed password in the users object
    const checkPassword = await bcrypt.compare(password, foundUser.password)
    if (!checkPassword) {
      res.status(400).json({ message: "This password is incorrect" })
    }

    // creating tokens if the user was found and the password was correct
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
      profilePic: foundUser.profilePic,
    }

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    })
    res.status(200).json({ authToken: authToken })
  } catch (error) {
    next(error)
  }
})

//edit user route
router.patch(
  "/edit-user",
  uploader.single("image"),
  verifyToken,
  async (req, res, next) => {
    const { email, password, bio, profilePic } = req.body

    if (!email && !password && !bio && !profilePic) {
      return res.status(400).json({
        message: "Please provide something to update",
      })
    }

    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/gm

    if (email && emailRegex.test(email) === false) {
      res.status(400).json({ message: "Please enter a real email" })
      return
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    if (password && passwordRegex.test(password) === false) {
      res.status(400).json({
        message:
          "Please enter a stronger password. Requirements: 8 charaters, one uppercase and one lowercase character",
      })
      return
    }

    try {
      const updatedUser = {}
      if (email) {
        updatedUser.email = email
      }
      if (password) {
        updatedUser.password = await bcrypt.hash(password, 12)
      }
      if (bio) {
        updatedUser.bio = bio
      }
      if (profilePic) {
        updatedUser.profilePic = profilePic
      }
      // check if the user exists before editing them
      const foundUser = await User.findOneAndUpdate(
        { _id: req.payload._id },
        updatedUser,
        { new: true },
      )
      if (!foundUser) {
        res.status(400).json({ message: "User not found" })
        return
      }
      const payload = {
        _id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role,
        profilePic: foundUser.profilePic,
      }

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "7d",
      })
      res.status(200).json({ authToken: authToken })
    } catch (error) {
      next(error)
    }
  },
)

// verifytoken route
router.get("/verify", verifyToken, (req, res, next) => {
  res.status(200).json(req.payload)
})

module.exports = router
