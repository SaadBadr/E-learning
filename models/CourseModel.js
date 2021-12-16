const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title must be specified."],
      validate: [
        {
          validator: function (v) {
            return /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF- ]*$|^[a-zA-Z]+[a-zA-Z-' ]*$/.test(
              v
            )
          },
          message:
            "Title must use only English or Arabic letters and special characters(space, ',  -)",
        },
        {
          validator: function (v) {
            return (v && v.length) <= 50
          },
          message: "Title must not exceed 50 characters",
        },
      ],
    },
    syllabus: {
      type: String,
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Instructor id must be specified."],
      ref: "User",
    },
    qa: {
      type: [mongoose.Schema.ObjectId],
      ref: "QAQuestion",
      default: [],
    },
    active: {
      // The course is active --> not deleted
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

// adding activities as virtual ref to get the activities that reference the course with "parent ref."
courseSchema.virtual("activities", {
  ref: "Activity",
  foreignField: "course",
  localField: "_id",
})

courseSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret, options) {
    var retJson = {
      id: ret._id,
      title: ret.title,
      syllabus: ret.syllabus,
      createdAt: ret.createdAt,
      instructor: ret.instructor,
      activities: ret.activities,
      qa: ret.qa,
    }
    return retJson
  },
})

// courseSchema.pre(/^find/, function () {
//   this.find({ active: true }).select("-active")
// })

const Course = mongoose.model("Course", courseSchema)
module.exports = Course
