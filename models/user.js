const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')

const user = new mongoose.Schema({
    email: String,
    username: String,
    password: String
});

user.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", user);