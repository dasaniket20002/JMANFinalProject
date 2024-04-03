const mongoose = require('mongoose');

const AuthLevelsSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    access_to: {
        type: [String],
        default: [],
    }
});

const AuthLevels = mongoose.model('AuthLevels', AuthLevelsSchema);
module.exports = AuthLevels;