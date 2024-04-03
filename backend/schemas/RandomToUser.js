const mongoose = require('mongoose');

const RandomToUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    random_id: {
        type: String,
        unique: true,
        required: true,
    },
    time_created: {
        type: Date,
        default: Date.now,
    },
    expiry: {
        type: Number,
        default: 300000, // 5min
    }
});

const RandomToUser = mongoose.model('RandomToUser', RandomToUserSchema);
module.exports = RandomToUser;