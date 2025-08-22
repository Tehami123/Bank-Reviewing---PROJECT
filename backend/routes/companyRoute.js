const express = require("express");
const companyController = require("../controllers/companyController");
const errorController = require("../controllers/errorController");

const router = express.Router();

router.get('/all', companyController.getAllCompanies);
router.get("/total-stats", errorController.getAllCompaniesTotalStats);
router.get("/stats", companyController.getCompaniesAllStats);
router.get("/:id", companyController.getCompanyById);

module.exports = router;
