const { Schema, model } = require("mongoose")
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

const Post = model("Post", postSchema)

module.exports = Post
