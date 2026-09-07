const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Auth required!!" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (e) {
    console.log("Error: " + e);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Auth required!!" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const foundAdmin = await User.findOne({
      _id: decodedToken.id,
      email: decodedToken.email,
    }).select("-password");
    if (!foundAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (foundAdmin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required!!" });
    }
    req.user = foundAdmin;
    next();
  } catch (e) {
    console.log("Error: " + e);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
    verifyAdmin,
    verifyToken 
}
