//userServices.js

const User = require("../models/Users");
const jwt = require("jsonwebtoken");

exports.signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.registerUser = async (username, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const newUser = await User.create({ username, email, password });
  const userWithoutPassword = await User.findById(newUser._id).select(
    "-password"
  );

  const accessToken = exports.signToken(newUser._id);

  return {
    accessToken,
    user: userWithoutPassword, 
  };
};
