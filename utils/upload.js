const multer = require("multer")
const path = require("path")

const postStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const fn = Date.now() + path.extname(file.originalname)
        cb(null, fn)
    },
})

const upload = multer({ storage: postStorage }).array("images", 5)
module.exports = upload