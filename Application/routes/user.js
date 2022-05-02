const express = require("express");
const userController = require("../controllers/userController");
const validators = require("../controllers/validators");

const router = express.Router();

router.get("/login",validators.authenticateUser, userController.showLogin);
router.get("/register",validators.authenticateUser, userController.showRegister);
router.get("/logout", userController.logOut);

router.post("/login", validators.validateLogin, userController.loginUser);
router.post("/register",validators.validateSignUp, userController.createAccount);

router.post("/testRegister", userController.createAccount);




module.exports = router;