const mongoose = require('mongoose');
const {Timestamp} = require("mongodb");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 8,

    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },
    phone: String,
    address: String,
}, {timestamps: true});


module.exports = mongoose.model("User", userSchema);
