const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true     //required
    },
    email: {
        type: String,
        required: true     //required
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dqqputx7b/image/upload/v1721291443/dummy_vuf3mm.png"
    },
    password: {
        type: String,
        required: true     //required
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    mobileVerified: {
        type: Boolean,
        default: false
    },
    emailCode: {
        type: String,
    },
    mobileCode: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    mobile: {
        type: Number,
        required: true       //required
    },
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)