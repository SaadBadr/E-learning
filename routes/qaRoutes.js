const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const courseController = require("../controllers/courseController")
const handlerFactory = require("./../controllers/handlerFactory")
const qaController = require("./../controllers/qaController")
const QAQuestion = require("../models/qaQuestionModel")
const router = express.Router({ mergeParams: true })

router
  .route("/")
  .post(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    qaController.createQuestion,
    handlerFactory.createOne(QAQuestion)
  )
  .get(
    courseController.courseRouteRestrictTo("admin", "instructor", "learner"),
    qaController.getQuestions,
    handlerFactory.getAll(QAQuestion)
  )

router
  .route("/:qid")
  .post(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    qaController.createReply
  )
  .patch(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    qaController.restrictToAuthor("Question"),
    qaController.updateQuestion,
    handlerFactory.updateOne(QAQuestion)
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    qaController.restrictToAuthor("Question"),
    handlerFactory.deleteOne(QAQuestion)
  )

router
  .route("/:qid/:rid")
  .patch(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    qaController.restrictToAuthor("Reply"),
    qaController.updateReply
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    qaController.restrictToAuthor("Reply"),
    qaController.deleteReply
  )
module.exports = router
