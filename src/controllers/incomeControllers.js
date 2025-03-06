// controllers/incomeControllers.js
const Income = require("../models/Income");

exports.createIncome = async (req, res) => {
  try {
    const { userId, amount, source, date } = req.body;

    console.log(req.body);

    const newIncome = new Income({
      userId,
      amount,
      source,
      date,
    });

    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(500).json({ message: "Грешка при създаване на доход", error });
  }
};

exports.getIncomesByUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const incomes = await Income.find({ userId: id });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Грешка при взимане на доходите", error });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, source, date } = req.body;

    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { amount, source, date },
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Доходът не е намерен" });
    }

    res.status(200).json(updatedIncome);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Грешка при актуализиране на дохода", error });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Доходът не е намерен" });
    }

    res.status(200).json({ message: "Доходът е изтрит успешно" });
  } catch (error) {
    res.status(500).json({ message: "Грешка при изтриване на дохода", error });
  }
};
