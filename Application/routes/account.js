const express = require("express");
const accountController = require("../controllers/accountController");
const validators = require("../controllers/validators");

const router = express.Router();


router.get("/edit-account", validators.userIsSignedIn, accountController.editAccount);


router.get("/account", validators.userIsSignedIn, accountController.getAccount);
router.post("/edit-account", accountController.changeDetails);


module.exports = router;