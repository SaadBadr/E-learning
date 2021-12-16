const express = require("express")
const authenticationController = require("../controllers/authenticationController")
const enrollController = require("./../controllers/enrollController")
const Course = require("../models/CourseModel")
const router = express.Router({ mergeParams: true })

router
  .route("/")
  .post(enrollController.enrollCourse)
  .delete(enrollController.unenrollCourse)

module.exports = router
