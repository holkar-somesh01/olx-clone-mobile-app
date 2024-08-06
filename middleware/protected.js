const jwt = require("jsonwebtoken")

exports.userProtected = (req, res, next) => {
    const { user } = req.cookies
    if (!user) { return res.status(401).json({ message: "No Cookie Found" }) }
    jwt.verify(user, process.env.JWT_KEY, (err, decode) => {
        console.log(decode)
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "JWT Error", error: err.message })
        }
        req.loggedInUser = decode.userId
        next()
    })

}