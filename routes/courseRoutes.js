const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const courseController = require("./../controllers/courseController");
const activityRoutes = require("./activityRoutes");
const router = express.Router();

router
  .route("/")
  .post(
    authenticationController.protect(),
    authenticationController.restrictTo("admin", "instructor"),
    courseController.courseCreate
  );

router
  .route("/:id")
  .get(authenticationController.protect(), courseController.courseGet);

// nested routes for activities
router.use("/:id/activities/", activityRoutes);

module.exports = router;
