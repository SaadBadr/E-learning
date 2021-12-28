const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const DbQueryManager = require("../utils/dbQueryManager")
const Course = require("../models/CourseModel")
const Question = require("../models/questionModel")
const User = require("../models/UserModel")

module.exports.createQuestion = catchAsync(async (req, res, next) => {
  const { title, description } = req.body
  req.body = { title, description, course: req.params.id, author: req.user._id }
  next()
})

module.exports.getAllQuestions = () =>
  catchAsync(async (req, res, next) => {
    const features = new DbQueryManager(Question.find())
    const doc = await features.all(req.query)

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
        total: await Question.countDocuments({ course: req.params.id }),
      },
    });
  })

module.exports.updateQuestion = catchAsync(async (req, res, next) => {
  const { title, description } = req.body
  req.body = { title, description }
  next()
})

module.exports.createReply = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.qid)
  if (!question || !question.course.equals(req.params.id))
    throw new AppError("Question not found!", 404)
  let reply = {
    author: req.user._id,
    reply: req.body.reply,
    createdAt: new Date(),
  }
  question.replies.push(reply)
  const q = await question.save()

  reply = { ...q.replies[q.replies.length - 1].toJSON({ virtuals: true }) }
  delete reply._id

  res.status(201).json({
    status: "success",
    data: { data: reply },
  })
})

module.exports.restrictToAuthor = (model) =>
  catchAsync(async (req, res, next) => {
    const question = await Question.findById(req.params.qid)
    if (!question || !question.course.equals(req.params.id))
      throw new AppError("Question not found!", 404)

    if (model == "Question") {
      if (!question.author.equals(req.user._id))
        throw new AppError("You are not allowed to perform this action!", 401)
    } else {
      const reply = question.replies.find((r) => r._id.equals(req.params.rid))
      if (!reply) throw new AppError("Reply not found!", 404)
      if (!reply.author.equals(req.user._id))
        throw new AppError("You are not allowed to perform this action!", 401)
      req.reply = reply
    }
    req.question = question
    next()
  })

module.exports.updateReply = catchAsync(async (req, res, next) => {
  req.reply.reply = req.body.reply
  await req.question.save()
  res.status(200).json({ status: "success", data: { data: req.reply } })
})

module.exports.deleteReply = catchAsync(async (req, res, next) => {
  req.question.replies = req.question.replies.filter(
    (r) => !r._id.equals(req.params.rid)
  )
  await req.question.save()
  res.status(204).json({ status: "success" })
})

module.exports.populateAuthors = catchAsync(async (req, res, next) => {
  req.query.popOptions = [
    {
      path: "author",
      select: "id firstName lastName username",
    },
    {
      path: "replies",
      populate: {
        path: "author",
        select: "id firstName lastName username",
      },
    },
  ]
  next()
})

module.exports.setCourseQuery = catchAsync(async (req, res, next) => {
  req.query.course = req.params.id
  next()
})
