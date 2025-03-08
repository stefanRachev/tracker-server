// controllers/incomeControllers.js
const Income = require("../models/Income");

exports.createIncome = async (req, res) => {
  try {
    const { amount, description, userId, type } = req.body;

    if ((!userId || !amount || !type || !description)) {
      return res
        .status(400)
        .json({ message: "Не са подадени всички задължителни полета" });
    }

    const newIncome = new Income({
      userId,
      amount,
      description,
      type,
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
    const { month, year } = req.query;
    let query = { userId: id };

    if (month && year) {
      query.createdAt = {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${parseInt(month) + 1}-01`),
      };
    }

    const incomes = await Income.find(query);
    res.status(200).json(incomes);
  } catch (error) {
    console.error("Грешка в getIncomesByUser:", error);
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
