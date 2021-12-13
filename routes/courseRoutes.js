const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const courseController = require("./../controllers/courseController")
const factoryHandler = require("./../controllers/factoryHandler")
const activityRoutes = require("./activityRoutes")
const Course = require("../models/CourseModel")
const router = express.Router()

router
  .route("/")
  .post(
    authenticationController.protect(),
    authenticationController.restrictTo("admin", "instructor"),
    courseController.courseCreate,
    factoryHandler.createOneFactory(Course)
  )

router
  .route("/:id")
  .get(authenticationController.protect(), courseController.courseGet)

// nested routes for activities
router.use(
  "/:id/activities/",
  authenticationController.protect(),
  activityRoutes
)

module.exports = router
