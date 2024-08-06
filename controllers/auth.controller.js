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
const User = require("../models/User")

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
    const { name, mobile, email, password, cpassword } = req.body
    const { isError, error } = checkEmpty({
        name, mobile, email, password, cpassword
    })
    if (isError) {
        return res.status(400).json({ message: "All Fields required", error })
    }
    if (!validator.isEmail) { return res.status(400).json({ message: "Invalid Email", }) }
    if (!validator.isMobilePhone(mobile, "en-IN")) { return res.status(400).json({ message: "Inalid Mobile" }) }
    if (!validator.isStrongPassword(password)) { return res.status(400).json({ message: "Provide Strong Password " }) }
    if (!validator.isStrongPassword(cpassword)) { return res.status(400).json({ message: "Provide Strong Password" }) }
    if (password !== cpassword) { { return res.status(400).json({ message: "Password Do not Match" }) } }
    const result = await User.findOne({ email })
    if (result) {
        return res.status(400).json({ message: "Email Already Registered with Us.!" })
    }
    const hash = await bcrypt.hash(password, 10)
    await User.create({ name, mobile, email, password: hash })
    res.json({ message: "User Register Success" })
})
exports.LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { error, isError } = checkEmpty({ email, password })
    if (isError) { return res.status(400).json({ message: "All Fields required", error }) }
    const result = await User.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: "Email Not Found" })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "Password Do not Match" })
    }
    //jWT
    const Token = JWT.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "180d" })
    //Cookie
    res.cookie("user", Token, {
        maxAge: 1000 * 60 * 60 * 24 * 180,
        // maxAge: 15552000000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    res.json({
        message: "User Login Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            mobile: result.mobile,
            avatar: result.avatar,
            mobileVerified: result.mobileVerified,
            emailVerified: result.emailVerified,
        }
    })
})

exports.LogoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("user")
    res.json({ message: "User Logout Success" })
})
exports.ChangeMobileNumber = asyncHandler(async (req, res) => {
    res.json({ message: "User Logout Success" })
})
