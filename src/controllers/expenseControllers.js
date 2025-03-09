const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  const { amount, description, userId, category, tags } = req.body;

  if (!amount || !description || !category || !userId) {
    return res.status(400).json({ message: "Моля, попълнете всички задължителни полета." });
  }

  try {
    const newExpense = new Expense({
      userId,
      amount,
      description,
      category,
      category,
      tags: tags || [],
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
  const { userId } = req.params;

  try {
    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Грешка при получаване на разходите." });
  }
};

exports.getTotalExpenses = async (req, res) => {
  const { userId } = req.params;

  try {
    const totalExpenses = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    res.status(200).json(totalExpenses[0] || { totalAmount: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Грешка при изчисляване на разходите." });
  }
};
