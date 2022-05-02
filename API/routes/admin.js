const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController');
const generateData = require("../controllers/generateData");

router.post("/ban", adminController.banAuction);

router.get("/generateTestData", generateData.generateTestData);

module.exports = router;


