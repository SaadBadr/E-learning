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
  req.popOptions = [
    {
      path: "instructor",
      select: "id firstName lastName username birthDate email background",
    },
    {
      path: "activities",
    },
  ]

  // filter quiz grades to only return the user grade
  req.customManipulation = function (doc) {
    doc.activities = doc.activities.map((activity) => {
      if (activity.grades) {
        activity.grades = activity.grades.filter((grade) =>
          grade.student.equals(this.user._id)
        )
        // deleting answers if user not the instructor
        if (!doc.instructor._id.equals(this.user._id)) activity.answers = null
      }
      return doc.activities
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
