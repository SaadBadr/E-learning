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

module.exports.getAllCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({})
  res.status(200).json({
    status: "success",
    data: { courses: courses },
  })
})

module.exports.courseGet = catchAsync(async (req, res, next) => {
  const courseId = req.params.id
  const userId = req.user._id.toString()
  const userType = req.user.type
  const course = await Course.findById(courseId)
    .populate("activities", "-active")
    .populate(
      "instructor",
      "id firstName lastName username birthDate email background"
    )

  if (!course) {
    throw new AppError("Course not found!", 400)
  }

  if (
    userType != "admin" &&
    course.instructor.id != userId &&
    !req.user.enrolledCourses.includes(courseId)
  ) {
    throw new AppError("You are not allowed to access this course", 401)
  }
  console.log(userId)
  if (req.user.enrolledCourses.includes(courseId)) {
    course.activities = course.activities.map((activity) => {
      if (activity.type == "QuizActivity") {
        i = activity["students"].findIndex((x) => x == userId)
        if (i >= 0) {
          activity["students"] = activity["students"][i]
          activity["grades"] = activity["grades"][i]
          console.log(userId)
          console.log(activity["students"])
        }
      }
      return activity
    })
  }
  res.status(200).json({
    status: "success",
    data: { course },
  })
})

module.exports.updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) throw new AppError("Course not found!", 404)
  if (course.instructor != req.user.id)
    throw new AppError("You are not authorized to update this course!", 401)

  const { title, syllabus, active } = req.body

  const updatedCourse = await Course.findByIdAndUpdate(
    course._id,
    { title, syllabus, active },
    {
      runValidators: true,
      new: true,
    }
  )

  res.status(200).json({
    status: "success",
    data: updatedCourse,
  })
})
