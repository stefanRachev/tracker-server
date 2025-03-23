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
  const {
    userId,
    description,
    type,
    subType,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

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
    const endDateObj = new Date(endDate);
    endDateObj.setHours(23, 59, 59, 999);
    filters.createdAt = { ...filters.createdAt, $lte: endDateObj };
  }

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  try {
    const incomes = await Income.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalIncomes = await Income.countDocuments(filters);
    const hasMore = totalIncomes > pageNumber * pageSize;

    res.status(200).json({ incomes, hasMore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching incomes." });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Income ID is required." });
  }

  try {
    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found." });
    }

    res.status(200).json({ message: "Income deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting income.", error });
  }
};

exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, subType } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Income ID is required." });
  }

  if (!description && !amount && !type && !subType) {
    return res
      .status(400)
      .json({ message: "At least one field is required for update." });
  }

  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { description, amount, type, subType },
      { new: true, runValidators: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found." });
    }

    res
      .status(200)
      .json({ message: "Income updated successfully.", income: updatedIncome });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating income.", error });
  }
};
