const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const activityController = require("./../controllers/activityController")
const courseController = require("./../controllers/courseController")
const handlerFactory = require("./../controllers/handlerFactory")
const VideoActivity = require("../models/videoActivityModel")
const Activity = require("../models/activityModel")
const PdfActivity = require("../models/pdfActivityModel")
const QuizActivity = require("../models/quizActivityModel")

// nested routes: courses/:id/activities/
const router = express.Router({ mergeParams: true })

router
  .route("/pdf")
  .post(
    courseController.courseRouteRestrictTo("instructor"),
    activityController.createActivity,
    activityController.uploadPdf,
    handlerFactory.createOne(PdfActivity)
  )

router
  .route("/pdf/:pid")
  .patch(
    courseController.courseRouteRestrictTo("instructor"),
    activityController.updatePdf,
    handlerFactory.updateOne(PdfActivity, "pid")
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.deleteOne(PdfActivity, "pid")
  )

router
  .route("/video")
  .post(
    courseController.courseRouteRestrictTo("instructor"),
    activityController.createActivity,
    handlerFactory.createOne(VideoActivity)
  )

router
  .route("/video/:vid")
  .patch(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.updateOne(VideoActivity, "vid")
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.deleteOne(VideoActivity, "vid")
  )

router
  .route("/quiz")
  .post(
    courseController.courseRouteRestrictTo("instructor"),
    activityController.createActivity,
    handlerFactory.createOne(QuizActivity)
  )

router
  .route("/quiz/:qid/")
  .post(
    courseController.courseRouteRestrictTo("learner"),
    activityController.submitQuiz
  )
  .patch(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.updateOne(QuizActivity, "qid")
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.deleteOne(QuizActivity, "qid")
  )

module.exports = router
