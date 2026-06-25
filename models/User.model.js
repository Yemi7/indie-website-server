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
    },
    profilePic: {
      type: String,
      default: "placeholder url",
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "dev", "admin"],
    },
  },
  {
    timestamps: true,
  },
)

const User = model("User", userSchema)

module.exports = User
