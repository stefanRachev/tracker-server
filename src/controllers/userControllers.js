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
