const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const activityController = require("./../controllers/activityController")
const factoryHandler = require("./../controllers/factoryHandler")
const VideoActivity = require("../models/videoActivityModel")
const PdfActivity = require("../models/pdfActivityModel")
const QuizActivity = require("../models/quizActivityModel")

// nested routes: courses/:id/activities/
const router = express.Router({ mergeParams: true })

router
  .route("/video")
  .post(
    activityController.activityCreate,
    factoryHandler.createOneFactory(VideoActivity)
  )

router
  .route("/pdf")
  .post(
    activityController.activityCreate,
    activityController.uploadPdf,
    factoryHandler.createOneFactory(PdfActivity)
  )

router
  .route("/quiz")
  .post(
    activityController.activityCreate,
    factoryHandler.createOneFactory(QuizActivity)
  )

router.route("/quiz/:id/").post(activityController.submitQuiz)
module.exports = router
