const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const activityController = require("./../controllers/activityController")
const courseController = require("./../controllers/courseController")
const handlerFactory = require("./../controllers/handlerFactory")
const VideoActivity = require("../models/videoActivityModel")
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
  .patch(
    courseController.courseRouteRestrictTo("instructor"),
    activityController.updatePdf,
    handlerFactory.updateOne(PdfActivity)
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.deleteOne(PdfActivity)
  )

router
  .route("/video")
  .post(
    courseController.courseRouteRestrictTo("instructor"),
    activityController.createActivity,
    handlerFactory.createOne(VideoActivity)
  )
  .patch(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.updateOne(VideoActivity)
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.deleteOne(VideoActivity)
  )

router
  .route("/quiz")
  .post(
    courseController.courseRouteRestrictTo("instructor"),
    activityController.createActivity,
    handlerFactory.createOne(QuizActivity)
  )
  .patch(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.updateOne(QuizActivity)
  )
  .delete(
    courseController.courseRouteRestrictTo("instructor"),
    handlerFactory.deleteOne(QuizActivity)
  )

router
  .route("/quiz/:qid/")
  .post(
    courseController.courseRouteRestrictTo("learner"),
    activityController.submitQuiz
  )
module.exports = router
