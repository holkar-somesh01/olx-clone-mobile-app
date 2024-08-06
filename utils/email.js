const nodemailer = require("nodemailer")

const sendEmail = ({ to, subject, message }) => new Promise((resolve, reject) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.EMAIL_PASS,
        }
    })
    transport.sendMail({
        from: process.env.FROM_EMAIL,
        to: to,
        subject: subject,
        html: message,
        text: message
    }, (err) => {
        if (err) {
            console.log(err)
            reject(false)
        } else {
            resolve(true)
        }
    })
})
module.exports = sendEmail