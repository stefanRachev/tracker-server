// controllers/incomeControllers.js
const Income = require("../models/Income");

exports.createIncome = async (req, res) => {
  const { amount, description, userId, type, subType } = req.body;

  if (!userId || !amount || !type || !description) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  const finalSubType = subType || "other";

  try {
    const newIncome = new Income({
      userId,
      amount,
      description,
      type,
      subType: finalSubType,
    });

    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(500).json({ message: "Error creating income", error });
  }
};

exports.getIncomes = async (req, res) => {
  const { userId, description, type, subType, startDate, endDate } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "UserId is required." });
  }

  const filters = { userId };

  if (description) {
    filters.description = { $regex: description, $options: "i" };
  }

  if (type) {
    filters.type = type;
  }

  if (subType) {
    filters.subType = subType;
  }

  if (startDate) {
    if (isNaN(new Date(startDate))) {
      return res.status(400).json({ message: "Invalid startDate." });
    }
    filters.createdAt = { ...filters.createdAt, $gte: new Date(startDate) };
  }

  if (endDate) {
    if (isNaN(new Date(endDate))) {
      return res.status(400).json({ message: "Invalid endDate." });
    }
    filters.createdAt = { ...filters.createdAt, $lte: new Date(endDate) };
  }

  try {
    const incomes = await Income.find(filters).sort({ createdAt: -1 });

    if (incomes.length === 0) {
      return res.status(404).json({ message: "No incomes found." });
    }

    res.status(200).json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching incomes." });
  }
};
