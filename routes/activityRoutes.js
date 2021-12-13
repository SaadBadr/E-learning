const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const activityController = require("./../controllers/activityController");

// nested routes: courses/:id/activities/
const router = express.Router({ mergeParams: true });

router.route("/video").post(activityController.videoActivityCreate);

module.exports = router;
