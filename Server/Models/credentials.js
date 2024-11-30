const mongoose = require('mongoose')

const CredentialsSchema  = new mongoose.Schema({
    count: Number,
})

const CredentialModel = mongoose.model("Credential",CredentialsSchema)
module.exports = CredentialModel;

