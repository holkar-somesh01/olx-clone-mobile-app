
const router = require("express").Router()
const AuthController = require("../controllers/auth.controller")

router
    // ADMIN
    .post("/register-admin", AuthController.RegisterAdmin)
    .post("/login-admin", AuthController.LoginAdmin)
    .post("/verify-admin-otp", AuthController.VerifyOTP)
    .post("/logout-admin", AuthController.LogoutAdmin)
    // USER
    .post("/register-mobile-user", AuthController.RegisterUser)
    .post("/login-mobile-user", AuthController.LoginUser)
    .post("/logout-mobile-user", AuthController.LogoutUser)
    .put("/change-mobile-password", AuthController.ChangeMobileNumber)
module.exports = router