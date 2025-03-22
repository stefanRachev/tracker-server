// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid or expired token");
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
