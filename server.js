require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./src/routes");
const app = express();
const mongoose = require("mongoose");
const { createProxyMiddleware } = require("http-proxy-middleware");

const port = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const corsOptions = {
  origin: ["http://localhost:5173", "https://tracker-client-zeta.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", routes);

app.get("/api/check-cookie", (req, res) => {
  const testCookie = req.cookies.test_cookie;

  if (testCookie) {
    res.status(200).json({
      status: "success",
      message: "Cookie found!",
      cookieValue: testCookie,
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "No cookie found.",
    });
  }
});

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://tracker-server-r17d.onrender.com",
    changeOrigin: true,
    secure: false,
    onProxyRes: (proxyRes, req, res) => {
      
      proxyRes.headers["Access-Control-Allow-Origin"] =
        "https://tracker-client-zeta.vercel.app";
      proxyRes.headers["Access-Control-Allow-Methods"] =
        "GET, POST, PUT, DELETE, OPTIONS";
      proxyRes.headers["Access-Control-Allow-Headers"] =
        "Content-Type, Authorization";
      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello from Vercel Serverless!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
