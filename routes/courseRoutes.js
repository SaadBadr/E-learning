const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const courseController = require("./../controllers/courseController")
const handlerFactory = require("./../controllers/handlerFactory")
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
    courseController.createCourse,
    handlerFactory.createOne(Course)
  )
  .get(handlerFactory.getAll(Course))

router
  .route("/:id")
  .get(
    authenticationController.protect(),
    courseController.courseRouteRestrictTo("admin", "instructor", "learner"),
    courseController.getCourse,
    handlerFactory.getOne(Course)
  )
  .patch(
    authenticationController.protect(),
    authenticationController.protect("admin", "instructor"),
    courseController.courseRouteRestrictTo("admin", "instructor"),
    handlerFactory.updateOne(Course)
  )
  .delete(handlerFactory.deleteOne(Course))

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
