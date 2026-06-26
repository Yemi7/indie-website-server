const { Schema, model } = require("mongoose")
const gameSchema = new Schema(
  {
    title: {
      type: String,
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
      // implement enum for established engines
    },
    cover: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      // array of objs with string url and text
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // status of the game
  },
  {
    timestamps: true,
  },
)

const Game = model("Game", gameSchema)

module.exports = Game
