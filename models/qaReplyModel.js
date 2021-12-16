const mongoose = require("mongoose")

const qaReplySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    reply: { type: String, required: true },
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

qaReplySchema.pre(/^find/, function () {
  this.find({ active: true }).select("-active")
})

const QAReply = mongoose.model("QAReply", qaReplySchema)
module.exports = QAReply
