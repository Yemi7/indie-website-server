const { Schema, model } = require("mongoose")
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "placeholder url",
    },
    role: {
      type: String,
      enum: ["user", "dev", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
)

const User = model("User", userSchema)

module.exports = User
