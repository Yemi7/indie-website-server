const { Schema, model } = require("mongoose")
const commentSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default: "Placeholder url",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  },
)

const Comment = model("Comment", commentSchema)

module.exports = Comment