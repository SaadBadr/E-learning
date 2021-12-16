const mongoose = require("mongoose")
const Activity = require("./activityModel")

const quizActivitySchema = new mongoose.Schema({
  quiz: {
    type: [
      {
        question: { type: String, required: true, trim: true },
        choices: [{ type: String, required: true, trim: true }],
      },
    ],
    required: [true, "Quiz must be specified."],
  },
  answers: {
    type: [Number],
    required: [true, "Answers must be specified."],
    min: 0,
  },
  grades: [{ student: mongoose.Schema.ObjectId, grade: Number }],
})

// quizActivity is a discriminator of Activity, i.e. quizActivity inherits Activity schema
const quizActivity = Activity.discriminator("QuizActivity", quizActivitySchema)
module.exports = quizActivity
