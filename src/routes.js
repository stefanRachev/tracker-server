//router.js

const router = require("express").Router();
const userControllers = require("./controllers/userControllers");
const incomeControllers = require("./controllers/incomeControllers");
const expenseControllers = require("./controllers/expenseControllers");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/validate-token", userControllers.validateToken);

router.post("/incomes", incomeControllers.createIncome);
router.get("/incomes/:id", incomeControllers.getIncomesByUser);


router.post("/expenses", expenseControllers.addExpense);
router.get("/expenses/:id", expenseControllers.getExpenses);
router.get("/expenses/total/:id", expenseControllers.getTotalExpenses);

module.exports = router;
