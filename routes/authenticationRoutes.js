const express = require("express")
const authenticationController = require("./../controllers/authenticationController")

const router = express.Router()

// router.post("/signup", authenticationController.protect(), authenticationController.restrictTo( "Admin"), authenticationController.signup);
router.post("/signup", authenticationController.signup)
router.post("/login", authenticationController.login)
router.post(
  "/admin-signup",
  authenticationController.protect(),
  authenticationController.adminSignup
)
router.get(
  "/",
  authenticationController.protect(),
  authenticationController.restrictTo("admin"),
  authenticationController.getAdmins
)
router.delete(
  "/:id",
  authenticationController.protect(),
  authenticationController.restrictTo("admin"),
  authenticationController.adminDelete
)
router.patch(
  "/admin-change-pass",
  authenticationController.protect(),
  authenticationController.restrictTo("admin"),
  authenticationController.adminChangePassword
)

module.exports = router

// VIP NOTE
// Admin endpoints should be separated in another controller
