const mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: {
        type: String,
        required: true     //required
    },
    category: {
        type: String,
        required: true     //required
    },
    desc: {
        type: String,
        required: true     //required
    },
    price: {
        type: Number,
        required: true     //required
    },
    images: {
        type: [String],
        required: true     //required
    },
    location: {
        type: String,
        required: true     //required
    },
}, { timestamps: true })

module.exports = mongoose.model("post", postSchema)