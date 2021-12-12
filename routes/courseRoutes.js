const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const courseController = require("./../controllers/courseController");

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

module.exports = router;
