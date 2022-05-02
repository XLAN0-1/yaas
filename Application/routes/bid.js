const express = require("express");
const bidController = require("../controllers/bidController");
const {userIsSignedIn} = require("../controllers/validators");

const router = express.Router();


router.post("/bid", userIsSignedIn, bidController.postNewBid);


module.exports = router;