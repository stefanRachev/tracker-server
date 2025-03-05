//userControllers.js
const userService = require("../services/userService");
const { validateFields } = require("../services/formValidation");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const errors = validateFields({ username, email, password });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: "fail",
      errors,
    });
  }

  try {
    const { accessToken, user } = await userService.registerUser(
      username,
      email,
      password
    );

    res.status(201).json({
      status: "success",
      accessToken,
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const errors = validateFields({ email, password });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: "fail",
      errors,
    });
  }

  try {
    const { accessToken, user } = await userService.loginUser(email, password);

    res.status(200).json({
      status: "success",
      accessToken,
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.validateToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "No token provided",
    });
  }

  try {
    const user = await userService.validateToken(token);

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};
