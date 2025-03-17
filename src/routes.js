//router.js

const router = require("express").Router();
const userControllers = require("./controllers/userControllers");
const incomeControllers = require("./controllers/incomeControllers");
const expenseControllers = require("./controllers/expenseControllers");
const balanceController = require("./controllers/balanceController");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/validate-token", userControllers.validateToken);
router.post("/refresh-token", userControllers.refreshToken);

router.post("/incomes", incomeControllers.createIncome);
router.get("/incomes", incomeControllers.getIncomes);

router.post("/expenses", expenseControllers.addExpense);
router.get("/expenses", expenseControllers.getExpenses);

router.get("/balance", balanceController.getBalance);

module.exports = router;
