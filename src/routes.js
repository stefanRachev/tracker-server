//router.js

const router = require("express").Router();
const userControllers = require("./controllers/userControllers");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/validate-token", userControllers.validateToken);

module.exports = router;
