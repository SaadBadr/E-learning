const mongoose = require("mongoose")
const Activity = require("./activityModel")

const videoActivitySchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "URL must be specified."],
    trim: true,
  },
})

// videoActivity is a discriminator of Activity, i.e. videoActivity inherits Activity schema
const videoActivity = Activity.discriminator(
  "VideoActivity",
  videoActivitySchema
)
module.exports = videoActivity
