require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");
const mongoose = require("mongoose");



//const port = process.env.PORT || 5001;

const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://tracker-client-hazel.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));



app.use("/api", routes);



app.get('/', (req, res) => {
  res.send('Hello from Vercel Serverless!');
});


module.exports = app; 

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
