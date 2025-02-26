const userService = require("../services/userService");
// const User = require("../models/Users");
// const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, user } = await userService.registerUser(
      email,
      password
    );

    res.status(201).json({
      status: "success",
      accessToken,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
