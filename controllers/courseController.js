const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const Course = require("../models/CourseModel")

module.exports.createCourse = catchAsync(async (req, res, next) => {
  const { syllabus, title } = req.body
  const instructor = req.user._id

  req.body = { syllabus, title, instructor }
  next()
})

module.exports.getCourse = catchAsync(async (req, res, next) => {
  req.query.popOptions = [
    {
      path: "instructor",
      select: "id firstName lastName username birthDate email background",
    },
    {
      path: "activities",
      options: {},
    },
  ]

  // adding sorting and pagination to activities
  if (req.query.sort) req.query.popOptions[1].options.sort = req.query.sort
  if (req.query.limit) {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1
    const skip = (page - 1) * limit
    req.query.popOptions[1].options.limit = limit
    req.query.popOptions[1].options.skip = skip
  }

  // filter quiz grades to only return the user grade
  req.customManipulation = function (doc) {
    doc.total = doc.activities.length
    doc.activities = doc.activities.map((activity) => {
      if (activity.grades) {
        activity.grades = activity.grades.filter((grade) =>
          grade.student.equals(this.user._id)
        )
        // deleting answers if user not the instructor
        if (!doc.instructor._id.equals(this.user._id)) activity.answers = null
      }
      return activity
    })
  }
  next()
})

// only instructor of the course => ["instructor"]
// instructor of the course and the admin ["instructor", "admin"]
// only students of the course ["learner"]
// only students of the course and the admin ["learner", "admin"]

module.exports.courseRouteRestrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id)

    if (!course) throw new AppError("Course not found!", 404)

    const adminAuhthorized = roles.includes("admin")
    const instructorAuhthorized = roles.includes("instructor")
    const learnerAuhthorized = roles.includes("learner")

    const adminCondition = adminAuhthorized && req.user.type == "admin"

    const instructorCondition =
      instructorAuhthorized && req.user._id.equals(course.instructor)

    const learnerCondition =
      learnerAuhthorized && req.user.enrolledCourses.includes(req.params.id)

    if (!(adminCondition || instructorCondition || learnerCondition)) {
      throw new AppError("You are not allowed to perform this action!", 401)
    }
    next()
  })
}
