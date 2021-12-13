const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
    },
    replies: [
      {
        type: String,
        trim: true,
        maxlength: 2000,
      },
    ],
    course: {
      type: mongoose.Schema.ObjectId,
      required: [true, "course id must be specified."],
      ref: "Course",
    },
    created_at: {
      type: Date,
      required: [true, "Created_at date property must be specified"],
    },
    active: {
      // The question is active --> not deleted
      type: Boolean,
      default: true,
    },
  },
  {
    strict: "throw",
  }
)

const Question = mongoose.model("Question", questionSchema)
module.exports = Question
