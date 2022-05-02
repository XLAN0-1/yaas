const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const validators = require("../controllers/validators");

router.post("/ban", adminController.banAuction);
router.get("/admin", validators.userIsAdmin, adminController.getAllAuctions);
router.get("/generateTestData", validators.userIsAdmin, adminController.getTestData)


module.exports = router;


