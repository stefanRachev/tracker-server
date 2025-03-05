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

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("User not found with this email");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const accessToken = exports.signToken(user._id);

  const userWithoutPassword = await User.findById(user._id).select("-password");

  return {
    accessToken,
    user: userWithoutPassword,
  };
};

exports.validateToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
