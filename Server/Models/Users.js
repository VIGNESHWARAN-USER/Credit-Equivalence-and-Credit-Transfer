const mongoose = require('mongoose')

const UsersSchema  = new mongoose.Schema({
    first: String,
    last: String,
    roll: String,
    year: String,
    dept: String,
    sec: String,
    pass: String,
    Email: String,
    role: String
})

const UsersModel = mongoose.model("Users",UsersSchema)
module.exports = UsersModel;