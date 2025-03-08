const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getBalance = async (req, res) => {

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "userId е задължителен!" });
  }
  
  try {
    const incomes = await Income.find({ userId: userId });
    const expenses = await Expense.find({ userId: userId });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const balance = totalIncome - totalExpense;
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ message: "Грешка при изчисляване на баланса" });
  }
};
