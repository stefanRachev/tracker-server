//userServices.js

const User = require("../models/Users");
const jwt = require("jsonwebtoken");

exports.signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });
};

exports.signRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

exports.registerUser = async (username, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  username = username.charAt(0).toUpperCase() + username.slice(1);

  const newUser = await User.create({ username, email, password });
  const userWithoutPassword = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  const accessToken = exports.signToken(newUser._id);
  const refreshToken = exports.signRefreshToken(newUser._id);

  newUser.refreshToken = refreshToken;
  await newUser.save();

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
  const refreshToken = exports.signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  const userWithoutPassword = await User.findById(user._id).select("-password -refreshToken");

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

exports.refreshAccessToken = async (token) => {
  if (!token) {
    console.log("No access token provided.");
    throw new Error("No access token provided");
  }

  const decoded = jwt.decode(token);

  if (!decoded || !decoded.id) {
    throw new Error("Invalid token");
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    jwt.verify(user.refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = exports.signToken(user._id);

  return newAccessToken;
};
