require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const itemRoutes = require("./src/routes");

const port = process.env.PORT || 5001;

const app = express();

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
  ],
  methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/api", itemRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
