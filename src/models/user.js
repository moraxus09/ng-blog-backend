const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {required: true, type: String},
    lastName: {required: true, type: String},
    email: {required: true, type: String},
    password: {required: true, type: String},
    avatarSrc: {required: false, type: String}
});
const User = mongoose.model('User', userSchema);

module.exports = User;