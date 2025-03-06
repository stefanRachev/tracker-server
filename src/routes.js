//router.js

const router = require("express").Router();
const userControllers = require("./controllers/userControllers");
const incomeControllers = require("./controllers/incomeControllers");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/validate-token", userControllers.validateToken);

router.post("/incomes", incomeControllers.createIncome); 
router.get("/incomes/:id", incomeControllers.getIncomesByUser); 
router.put("/incomes/:id", incomeControllers.updateIncome);
router.delete("/incomes/:id", incomeControllers.deleteIncome);

module.exports = router;
