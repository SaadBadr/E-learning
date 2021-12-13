const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")
const Course = require("../models/CourseModel")

module.exports.courseCreate = catchAsync(async (req, res, next) => {
  const { syllabus, title } = req.body
  const instructor = req.user._id

  req.body = { syllabus, title, instructor }
  next()
})

module.exports.courseGet = catchAsync(async (req, res, next) => {
  const courseId = req.params.id
  const userId = req.user._id
  const userType = req.user.type
  const course = await Course.findById(courseId).populate(
    "activities",
    "-active -__v"
  )

  if (!course) {
    throw new AppError("Course not found!", 400)
  }

  if (
    userType != "admin" &&
    course.instructor != userId &&
    !req.user.enrolledCourses.includes(courseId)
  ) {
    throw new AppError("You are not allowed to access this course", 401)
  }

  if (req.user.enrolledCourses.includes(courseId)) {
    course.activities.map((activity) => {
      if (activity["__it"] == "QuizActivity") {
        i = activity["students"].findIndex((x) => x == 4)
        activity["students"] = activity["students"][i]
        activity["grades"] = activity["grades"][i]
      }
      return activity
    })
  }
  res.status(200).json({
    status: "success",
    data: course,
  })
})
