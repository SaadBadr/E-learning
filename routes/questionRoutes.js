const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const courseController = require("../controllers/courseController")
const handlerFactory = require("./../controllers/handlerFactory")
const questionController = require("./../controllers/questionController")
const Question = require("../models/questionModel")
const router = express.Router({ mergeParams: true })

router
  .route("/")
  .post(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    questionController.createQuestion,
    handlerFactory.createOne(Question)
  )
  .get(
    courseController.courseRouteRestrictTo("admin", "instructor", "learner"),
    questionController.populateAuthors,
    questionController.setCourseQuery,
    handlerFactory.getAll(Question)
  )

router
  .route("/:qid")
  .get(
    courseController.courseRouteRestrictTo("instructor", "learner", "admin"),
    questionController.populateAuthors,
    handlerFactory.getOne(Question, null, "qid")
  )
  .patch(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    questionController.restrictToAuthor("Question"),
    questionController.updateQuestion,
    handlerFactory.updateOne(Question, "qid")
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    questionController.restrictToAuthor("Question"),
    handlerFactory.deleteOne(Question, "qid")
  )

router
  .route("/:qid/replies")
  .post(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    questionController.createReply
  )

router
  .route("/:qid/replies/:rid")
  .patch(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    questionController.restrictToAuthor("Reply"),
    questionController.updateReply
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor", "learner"),
    questionController.restrictToAuthor("Reply"),
    questionController.deleteReply
  )
module.exports = router
