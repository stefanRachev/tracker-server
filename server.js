require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");
const mongoose = require("mongoose");
const path = require("path");
const { title } = require("process");

const port = process.env.PORT || 5001;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://tracker-server-xob4.onrender.com",
    "https://expense-tracker-olive-one.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/api", routes);

app.use(express.static(path.join(__dirname, "..", "tracker-client", "dist")));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Expense Tracker",
    description: "Track your expenses and manage your budget effortlessly.",
    image: "/images/logo.svg",
    url: "https://expense-tracker-olive-one.vercel.app/",
  });
});

app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "tracker-client", "dist", "index.html")
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
