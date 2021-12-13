const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")
const Course = require("../models/CourseModel")
const { promisify } = require("util")
const path = require("path")
const QuizActivity = require("../models/quizActivityModel")

module.exports.activityCreate = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) throw new AppError("Invalid course!", 400)
  if (req.user.id != course.instructor)
    throw new AppError("You are unauthorized!", 401)
  req.body.course = course._id
  next()
})

module.exports.uploadPdf = catchAsync(async (req, res, next) => {
  const file = req.files.file
  if (file.mimetype != "application/pdf")
    throw new AppError("Only Pdf files are allowed!", 400)
  const filename = file.name
  const savedname = file.md5 + new Date().getTime()
  const extension = path.extname(filename)
  const url = `/public/uploads/pdf/${savedname}${extension}`
  await promisify(file.mv)(`.${url}`)
  req.body.url = url
  next()
})

module.exports.submitQuiz = catchAsync(async (req, res, next) => {
  const quiz = await QuizActivity.findById(req.params.id)
  if (!quiz) throw new AppError("Quiz not found!", 404)

  if (!req.user.enrolledCourses.includes(quiz.course))
    throw new AppError("You are not allowed to take this quiz", 401)

  let answers = req.body

  if (answers.length > quiz.answers.length)
    answers = answers.slice(0, quiz.answers.length)

  let grade = 0
  for (let i = 0; i < answers.length; i++)
    if (answers[i] == quiz.answers[i]) grade++

  grade = (grade / answers.length) * 100
  quiz.students.append(user.id)
  quiz.grades.append(grade)

  await quiz.save()

  return res.status(200).json({
    status: "success",
    data: {
      grade,
    },
  })
})
