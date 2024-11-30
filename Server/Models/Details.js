const mongoose = require('mongoose')

const DetailsSchema  = new mongoose.Schema({
    name: String,
    roll: String,
    sec: String,
    year: String,
    dept: String,
    Email: String,
    courseTitle: String,
    courseCode: String,
    orgcourseCode: String,
    offeredBy: String,
    modeOfStudy: String,
    duration: String,
    credits: String,
    assessmentMethod: String,
    mark: String,
    grade: String,
    courseLink: String,
    status: String,
    type: String,
    ca: String,
    hod: String,
    dir: String,
})

const DetailsModel = mongoose.model("Details",DetailsSchema)
module.exports = DetailsModel;