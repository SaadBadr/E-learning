const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")
const Course = require("../models/CourseModel")
const User = require("../models/UserModel")

module.exports.enrollCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError("Course not found!", 404)

  if (
    req.user.enrolledCourses.includes(course._id) ||
    req.user.id == course.instructor
  )
    throw new AppError("You are already enrolled in this course", 400)

  const user = await User.findById(req.user.id)
  if (!user) throw new AppError("User not found!", 404)

  user.enrolledCourses.push(course._id)
  await user.save()

  res.status(200).json({
    status: "success",
  })
})

module.exports.unenrollCourse = catchAsync(async (req, res, next) => {
  const user = User.findById(req.user.id)
  if (!course) throw new AppError("User not found!", 404)

  user.enrolledCourses.filter((id) => id != course._id)
  await user.save()

  res.status(200).json({
    status: "success",
  })
})
