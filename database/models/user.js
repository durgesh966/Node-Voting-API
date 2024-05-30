const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String,
    },
    email: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    adharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["voter", "admin"],
        default: "voter"
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model("User", personSchema);
module.exports = User;
