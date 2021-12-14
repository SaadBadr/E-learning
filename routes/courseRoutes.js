const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const courseController = require("./../controllers/courseController")
const factoryHandler = require("./../controllers/factoryHandler")
const activityRoutes = require("./activityRoutes")
const enrollRoutes = require("./enrollRoutes")
const qaRoutes = require("./qaRoutes")
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
  .get(courseController.getAllCourses)

router
  .route("/:id")
  .get(authenticationController.protect(), courseController.courseGet)
  .patch(
    authenticationController.protect(),
    authenticationController.restrictTo("admin", "instructor"),
    courseController.updateCourse
  )

// nested routes for activities
router.use(
  "/:id/activities/",
  authenticationController.protect(),
  activityRoutes
)

// nested routes for enroll
router.use("/:id/enroll/", authenticationController.protect(), enrollRoutes)

// nested routes for QA
router.use("/:id/qa/", authenticationController.protect(), qaRoutes)

module.exports = router
