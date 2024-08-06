// Admin Register
// Admin login
// Admin otp verify
// Admin logout

// User Register
// User verify email
// User login
// User logout

const asyncHandler = require("express-async-handler")
const validator = require("validator")
const { checkEmpty } = require("../utils/checkEmpty")
const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")
const Admin = require("../models/Admin")
const sendEmail = require("../utils/email")

// ADMIN
exports.RegisterAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const { isError, error } = checkEmpty({ name, email, password })
    if (isError) {
        return res.status(400).json({ message: "All Feiled Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide Strong Password" })
    }
    const isFound = await Admin.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "Email Already registered with us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })
    res.json({ message: "Admin Register Success" })
})
exports.LoginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Fields required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid email" : "Invalid Credentials" })
    }
    const isFound = await Admin.findOne({ email })
    if (!isFound) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid email" : "Invalid Credentials" })
    }
    const isVerify = await bcrypt.compare(password, isFound.password)
    if (!isVerify) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid password" : "Invalid Credentials" })
    }

    // send OTP
    const otp = Math.floor(10000 + Math.random() * 900000)
    await Admin.findByIdAndUpdate(isFound._id, { otp: otp })
    await sendEmail({
        to: email, subject: `Login OTP`, message: `<h1>Do Not share Your Account OTP</h1>
        <p>Your Login OTP <strong>${otp}</strong> </p>`
    })
    res.json({ message: "Credentials Verify Success. OTP send to your registered Email" })

})
exports.VerifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ otp, email })
    if (isError) {
        return res.status(401).json({ message: "All Fields required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid email" : "Invalid Credentials" })
    }
    const isFound = await Admin.findOne({ email })
    if (!isFound) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid email" : "Invalid Credentials" })
    }
    if (otp !== isFound.otp) {
        res.status(401).json({ message: "Invalid OTP" })
    }
    //jWT
    const Token = JWT.sign({ userID: isFound._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    //Cookie
    res.cookie("admin", Token, {
        maxAge: 86400000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    res.json({
        message: "OTP Verify Success.", result: {
            _id: isFound._id,
            name: isFound.name,
            email: isFound.email,
        }
    })
})
exports.LogoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "Admin Login Success" })
})

// USER
exports.RegisterUser = asyncHandler(async (req, res) => {
    res.json({ message: "User Register Success" })
})
exports.LoginUser = asyncHandler(async (req, res) => {
    res.json({ message: "User Register Success" })
})
exports.EmailVerifyUser = asyncHandler(async (req, res) => {
    res.json({ message: "User Register Success" })
})
exports.LogoutUser = asyncHandler(async (req, res) => {
    res.json({ message: "User Register Success" })
})
