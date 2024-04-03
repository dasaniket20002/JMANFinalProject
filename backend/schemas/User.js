const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },
    created_by: {
        type: String,
    },
    role: {
        type: String,
        required: true,
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;