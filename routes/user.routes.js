
const router = require("express").Router()
const userController = require("./../controllers/user.controller")
const { userProtected } = require("../middleware/protected")

router
    .post("/verify-user-email", userProtected, userController.VerifyUserEmail)
    .post("/verify-user-email-otp", userProtected, userController.VerifyEmailOTP)

    .post("/verify-user-mobile", userProtected, userController.VerifyUserMobile)
    .post("/verify-user-mobile-otp", userProtected, userController.VerifyMobileOTP)

    .post("/add-post", userProtected, userController.addPost)
    .post("/get-location", userProtected, userController.getLocation)

module.exports = router