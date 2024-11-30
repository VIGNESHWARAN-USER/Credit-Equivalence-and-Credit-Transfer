const mongoose = require('mongoose')

const CourseSchema  = new mongoose.Schema({
    code: String,
    orgcoursecode: String,
    name: String,
    week: String,
})

const CourseModel = mongoose.model("Course",CourseSchema)
module.exports = CourseModel;