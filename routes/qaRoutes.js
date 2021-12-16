const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const qaController = require("./../controllers/qaController")
const Course = require("../models/CourseModel")
const router = express.Router({ mergeParams: true })

router
  .route("/")
  .post(qaController.questionCreate)
  .get(qaController.getQuestions)

router
  .route("/:qid")
  .post(qaController.replyCreate)
  .get(qaController.getReplies)

module.exports = router
