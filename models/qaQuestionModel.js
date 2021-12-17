const mongoose = require("mongoose")
const replySchema = new mongoose.Schema(
  {
    reply: String,
    author: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

replySchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    return ret
  },
})

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
    replies: [
      {
        type: {
          reply: String,
          author: { type: mongoose.Schema.ObjectId, ref: "User" },
          createdAt: Date,
        },
      },
    ],
    active: {
      // The activity is active --> not deleted
      type: Boolean,
      default: true,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: true, updatedAt: false },
  }
)

qaQuestionSchema.pre(/^find/, function () {
  this.find({ active: true }).select("-active")
})

qaQuestionSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    ret.replies?.forEach(function (reply) {
      reply.id = reply._id
      delete reply._id
    })
    return ret
  },
})

const QAQuestion = mongoose.model("QAQuestion", qaQuestionSchema)
module.exports = QAQuestion
