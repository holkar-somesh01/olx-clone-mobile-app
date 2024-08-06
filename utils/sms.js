const unirest = require("unirest");

exports.SendSMS = ({ message = "", numbers = "" }) => new Promise((resolve, reject) => {
    const req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

    req.headers({
        "authorization": process.env.SMS_API_KEY
    });

    req.form({
        "message": message,
        "language": "english",
        "route": "q",
        "numbers": numbers,
    });

    req.end(function (res) {
        if (res.error) {
            console.log(res.error)
            reject(res.error)
            // throw new Error(res.error)
        }
        console.log(res.body)
        resolve(true)
    });
})