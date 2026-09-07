const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require("jsonwebtoken");




const userSignup =  async (req, res) => {
    try {

        const {name, email, password} = req.body;
        if ( !email || !password) {
            console.error("Email and password missing");
            return res.status(400).json({message: "All fields are required!!"});
        
        }
        let userExists = await User.findOne({email: email.toLowerCase()});
        if (userExists) {
            console.error("Signup user already exits!!");
            return res.status(409).json({message: "User already exists!!"});
        }
        let hashedPassword = bcrypt.hashSync(password, 10);
        let newCreatedUser = new User({name, email: email.toLowerCase(), password: hashedPassword});
        await newCreatedUser.save();
        
        return res.status(201).json({
            message: "User created successfully!!",
            user: {id: newCreatedUser._id, name: newCreatedUser.name, email: newCreatedUser.email, role: newCreatedUser.role}
        });

    } catch (error) {
        console.error("Error: " + error);
        return res.status(500).json({message: "Internal server error!!"});
    }

}

const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "All fields are required!!"});
        }
        let foundUser = await User.findOne({email: email.toLowerCase()});
        if (!foundUser) {
            return res.status(404).json({message: "User not found, Signup Instead!!"});
        }
        let isPasswordValid = bcrypt.compareSync(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid credentials, wrong password!!"});
        }
        res.cookie("token",generateToken(foundUser),{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            message: "User logged in successfully!!",
            user: {id: foundUser._id, name: foundUser.name, email: foundUser.email, role: foundUser.role

            }
        });
    } catch (error) {
        console.error("Error: " + error);
        return res.status(500).json({message: "Internal server error!!"});
    }
}

const getCurrentUser = async (req, res) => {
    return res.status(200).json({ user: req.user });
};

const updateProfile = async (req, res) => {
    try {
        const allowedFields = ["name", "phone", "address"];
        const updates = Object.fromEntries(
            Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
        );
        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");
        return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        return res.status(400).json({ message: "Unable to update profile", error: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    return res.status(200).json({ message: "Logged out successfully" });
};
const generateToken = (user) => {
    return jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET,
        {expiresIn: '7d'});
}

module.exports = {userSignup, userLogin, getCurrentUser, updateProfile, logout, generateToken};