const mongoose = require("mongoose")

// this schema is considered as the base schema for: videoActivity, quizActivity, pdfActivity

const qaQuestionSchema = new mongoose.Schema(
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
    author: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    replies: {
      type: [mongoose.Schema.ObjectId],
      required: true,
      ref: "QAReply",
    },
    active: {
      // The activity is active --> not deleted
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: true, updatedAt: false },
  }
)

const QAQuestion = mongoose.model("QAQuestion", qaQuestionSchema)
module.exports = QAQuestion
