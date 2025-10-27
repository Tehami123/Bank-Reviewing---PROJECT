// routes/companyRoute.js
const express = require("express");
const { getAllCompanies, getCompaniesAllStats, getCompanyById } = require("../controllers/companyController");
const { getAllCompaniesTotalStats } = require("../controllers/companyStatsController");

const router = express.Router();

router.get("/all", getAllCompanies);
router.get("/total-stats", getAllCompaniesTotalStats);
router.get("/stats", getCompaniesAllStats);
router.get("/:id", getCompanyById);

module.exports = router;
