const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const Course = require("../models/CourseModel")
const User = require("../models/UserModel")

module.exports.enrollCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError("Course not found!", 404)

  if (
    req.user.enrolledCourses.includes(course._id) ||
    req.user._id.equals(course.instructor)
  )
    throw new AppError("You are already enrolled in this course", 400)

  req.user.enrolledCourses.push(course._id)
  await req.user.save()

  res.status(200).json({
    status: "success",
  })
})

module.exports.unenrollCourse = catchAsync(async (req, res, next) => {
  req.user.enrolledCourses = req.user.enrolledCourses.filter(
    (id) => !id.equals(req.params.id)
  )
  await req.user.save()

  res.status(204).json({
    status: "success",
  })
})
