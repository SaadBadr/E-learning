const mongoose = require("mongoose")

// this schema is considered as the base schema for: videoActivity, quizActivity, pdfActivity
const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      required: [true, "Title must be specified."],
    },
    description: {
      type: String,
      trim: true,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: true,
    },
    active: {
      // The activity is active --> not deleted
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

activitySchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    ret.type = ret.__t
    delete ret._id
    delete ret.__t
    delete ret.__v
    delete ret.active
    return ret
  },
})

const Activity = mongoose.model("Activity", activitySchema)
module.exports = Activity
