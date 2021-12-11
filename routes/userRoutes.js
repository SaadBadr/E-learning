const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.get("/me", authenticationController.protect(), userController.me);
router.put("/:id/role", authenticationController.protect(), authenticationController.restrictTo("admin"), userController.changeRole);


module.exports = router;
