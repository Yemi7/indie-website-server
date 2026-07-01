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
      default:
        "https://img.magnific.com/premium-vector/default-avatar-profile-icon-gray-placeholder-vector-illustration_514344-14757.jpg?semt=ais_hybrid&w=740&q=80",
    },
    role: {
      type: String,
      enum: ["user", "dev", "admin"],
      default: "user",
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const User = model("User", userSchema)

module.exports = User
