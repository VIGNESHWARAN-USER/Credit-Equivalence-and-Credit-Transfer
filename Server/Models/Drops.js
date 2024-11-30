const mongoose = require('mongoose')

const DropsSchema  = new mongoose.Schema({
    name: String,
    roll: String,
    sec: String,
    year: String,
    dept: String,
    Email: String,
    courseName: String,
    courseCode: String,
    category: String,
    semester: String,
    credits: String,
    status: String,
    type: String,
    ca: String,
    hod: String,
    dir: String,
})

const DropsModel = mongoose.model("Drops",DropsSchema)
module.exports = DropsModel;