const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String, 
      enum: ["salary", "bonus", "investment", "other"],
      required: true,
    },
    subType: {
      type: String,
      enum: ["sale", "gambling", "gift", "refund", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;
