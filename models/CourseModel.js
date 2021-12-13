const mongoose = require("mongoose");

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
            );
          },
          message:
            "Title must use only English or Arabic letters and special characters(space, ',  -)",
        },
        {
          validator: function (v) {
            return (v && v.length) <= 50;
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
    active: {
      // The course is active --> not deleted
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// adding id as virtual to be alias for _id
courseSchema.virtual("id").get(function () {
  return this._id;
});

// adding activities as virtual ref to get the activities that reference the course with "parent ref."
courseSchema.virtual("activities", {
  ref: "Activity",
  foreignField: "course",
  localField: "_id",
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
