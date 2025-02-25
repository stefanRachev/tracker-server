require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const itemRoutes = require("./src/routes");
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

app.get("/", (req, res) => {
  res.render("index", { 
    title: "Expense Tracker - Home", 
    description: "Track your expenses easily with our Expense Tracker App" 
  });
});

app.use("/api", itemRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
