const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const PdfActivity = require("../models/pdfActivityModel")
const Course = require("../models/CourseModel")
const path = require("path")
const QuizActivity = require("../models/quizActivityModel")
const fs = require("fs")
const { promisify } = require("util")

module.exports.createActivity = catchAsync(async (req, res, next) => {
  req.body.course = req.params.id
  next()
})

module.exports.uploadPdf = catchAsync(async (req, res, next) => {
  const file = req.files.file
  if (file.mimetype != "application/pdf")
    throw new AppError("Only Pdf files are allowed!", 400)
  const filename = file.name
  const savedname = file.md5 + new Date().getTime()
  const extension = path.extname(filename)
  var fs = require("fs")

  const dir = `./public/uploads/pdf/${req.params.id}`
  if (!fs.existsSync(dir)) await promisify(fs.mkdir)(dir, { recursive: true })

  const url = `/public/uploads/pdf/${req.params.id}/${savedname}${extension}`
  await promisify(file.mv)(`.${url}`)
  req.body.url = url
  next()
})

module.exports.updatePdf = catchAsync(async (req, res, next) => {
  const activity = await PdfActivity.findById(req.params.pid)

  if (!activity)
    return next(new AppError("No document found with that ID", 404))

  if (!req.files?.file) next()
  // upload new file
  const file = req.files.file
  if (file.mimetype != "application/pdf")
    throw new AppError("Only Pdf files are allowed!", 400)
  const filename = file.name
  const savedname = file.md5 + new Date().getTime()
  const extension = path.extname(filename)
  var fs = require("fs")

  const dir = `./public/uploads/pdf/${req.params.id}`
  if (!fs.existsSync(dir)) await promisify(fs.mkdir)(dir)

  const url = `/public/uploads/pdf/${req.params.id}/${savedname}${extension}`
  await promisify(file.mv)(`.${url}`)
  req.body.url = url

  // delete old file
  await promisify(fs.unlink)(`.${activity.url}`)

  next()
})

module.exports.submitQuiz = catchAsync(async (req, res, next) => {
  const quiz = await QuizActivity.findById(req.params.qid)
  if (!quiz) throw new AppError("Quiz not found!", 404)

  if (!req.user.enrolledCourses.includes(quiz.course))
    throw new AppError("You are not allowed to take this quiz", 401)

  const { answers } = req.body

  if (answers.length > quiz.answers.length)
    answers = answers.slice(0, quiz.answers.length)

  let grade = 0
  for (let i = 0; i < answers.length; i++)
    if (answers[i] == quiz.answers[i]) grade++

  grade = (grade / answers.length) * 100
  prev_solution = quiz.grades.find((x) => x.student == req.user.id)
  if (prev_solution)
    prev_solution.grade =
      grade > prev_solution.grade ? grade : prev_solution.grade
  else quiz.grades.push({ student: req.user.id, grade: grade })

  await quiz.save()

  return res.status(200).json({
    status: "success",
    data: {
      grade,
    },
  })
})
