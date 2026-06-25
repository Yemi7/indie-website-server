//stop duplicate connection problems on some hosting services
const mongoose = require("mongoose")

const connectDB = async (app) => {
  if (mongoose.connection.readyState === 1) {
    return
  }

  try {
    const response = await mongoose.connect(process.env.MONGO_URI)
    const dbName = response.connections[0].name
    console.log(`Connected to mongo! Database name: "${dbName}"`)
  } catch (error) {
    console.error("Error connecting to mongo:", error)
  }
}
module.exports = connectDB
