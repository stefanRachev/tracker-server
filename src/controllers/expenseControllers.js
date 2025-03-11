const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  const { amount, description, userId, category } = req.body;

  if (!amount || !description || !category || !userId) {
    return res
      .status(400)
      .json({ message: "Моля, попълнете всички задължителни полета." });
  }

  try {
    const newExpense = new Expense({
      userId,
      amount,
      description,
      category,
      category,     
    });

    await newExpense.save();

    res
      .status(201)
      .json({ message: "Разходът беше добавен успешно.", newExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Грешка при добавяне на разход." });
  }
};

exports.getExpenses = async (req, res) => {
  const { userId, description, category, startDate, endDate } = req.query;

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
  if (startDate && endDate) {
    filters.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    const expenses = await Expense.find(filters).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Грешка при извличане на разходите." });
  }
};
