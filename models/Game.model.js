const { Schema, model } = require("mongoose")
const gameSchema = new Schema(
  {
    title: {
      type: [String],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expectedRelease: {
      type: Date,
      required: true,
    },
    engine: {
      type: String,
      required: true,
    },
    cover: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
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

const Game = model("Game", gameSchema)

module.exports = Game
