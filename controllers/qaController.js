const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")
const Course = require("../models/CourseModel")
const QAQuestion = require("../models/qaQuestionModel")
const QAReply = require("../models/qaReplyModel")
const User = require("../models/UserModel")

module.exports.questionCreate = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError("Course not found!", 404)

  if (
    !req.user.enrolledCourses.includes(course._id) &&
    req.user.id != course.instructor
  )
    throw new AppError("You are not enrolled in this course", 400)

  const { title, description } = req.body
  const question = new QAQuestion({ title, description, author: req.user.id })
  await question.save()

  course.qa.push(question._id)
  await course.save()

  res.status(200).json({
    status: "success",
    data: { question },
  })
})

module.exports.replyCreate = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course) throw new AppError("Course not found!", 404)

  if (
    !req.user.enrolledCourses.includes(course._id) &&
    req.user.id != course.instructor
  )
    throw new AppError("You are not enrolled in this course", 400)

  const question = await QAQuestion.findById(req.params.qid)
  if (!question) throw new AppError("Question not found!", 404)

  const { reply } = req.body
  const relpy = new QAReply({ reply, author: req.user.id })
  await relpy.save()

  question.replies.push(relpy._id)
  await question.save()

  res.status(200).json({
    status: "success",
    data: relpy,
  })
})

module.exports.getQuestions = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate("qa")
    .select("qa")
    .populate({
      path: "qa",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    })

  if (!course) throw new AppError("Course not found!", 404)

  if (
    !req.user.enrolledCourses.includes(course._id) &&
    req.user.id != course.instructor
  )
    throw new AppError("You are not enrolled in this course", 401)

  res.status(200).json({
    status: "success",
    data: course,
  })
})

module.exports.getReplies = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course) return new AppError("Course not found!", 404)

  const question = await QAQuestion.findById(req.params.qid)
    .populate("replies", "reply auhor createdAt")
    .populate({
      path: "replies",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    })

  if (!question) throw new AppError("Question not found!", 404)

  if (
    !req.user.enrolledCourses.includes(course._id) &&
    req.user.id != course.instructor
  )
    throw new AppError("You are not enrolled in this course", 401)

  res.status(200).json({
    status: "success",
    data: question,
  })
})
