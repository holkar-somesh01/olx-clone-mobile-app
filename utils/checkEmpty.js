const validator = require("validator")
exports.checkEmpty = (fields) => {
    const error = {}
    let isError = false
    for (const key in fields) {
        if (validator.isEmpty(fields[key] ? "" + fields[key] : "")) {    //("" + , string) function use for convert a number to staring
            error[key] = `${key} is Required`
            isError = true
        }
    }
    return { isError, error }
}