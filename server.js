require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");
const app = express();
const mongoose = require("mongoose");


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


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", routes);

app.options("*", cors(corsOptions));



app.get("/", (req, res) => {
  res.send("Hello from Render!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
