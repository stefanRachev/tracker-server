const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  const { amount, description, userId, category } = req.body;

  if (!amount || !description || !category || !userId) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  try {
    const newExpense = new Expense({
      userId,
      amount,
      description,
      category,    
    });

    await newExpense.save();

    res
      .status(201)
      .json({ message: "Expense added successfully.", newExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding expense." });
  }
};

exports.getExpenses = async (req, res) => {
  const { userId, description, category, startDate, endDate, page = 1, limit = 10 } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "UserId is required." });
  }

  const filters = { userId };

  if (description) {
    filters.description = { $regex: description, $options: "i" };
  }

  if (category) {
    filters.category = category;
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

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  try {
    const expenses = await Expense.find(filters)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(pageSize);

    const totalExpenses = await Expense.countDocuments(filters); 
    const hasMore = totalExpenses > pageNumber * pageSize; 

    res.status(200).json({ expenses, hasMore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching expenses." });
  }
};
