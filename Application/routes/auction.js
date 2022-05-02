const express = require("express");
const auctionController = require("../controllers/auctionController");
const validators = require("../controllers/validators");


const router = express.Router();



// router.get("/auctions/:id/confirm", auctionController.confirmAuction);
router.get("/", auctionController.getActiveAuctions);
router.get("/auctions/:id", auctionController.getAuctionById);
router.get("/auctions/:id/bids", auctionController.getBidHistory);
router.get("/create-auction",validators.userIsSignedIn, auctionController.showCreateAuction);
router.get("/verify-auction", auctionController.showConfirmAuction);
router.get("/auctions/:id/confirm", auctionController.confirmAuction);
router.get("/auctions/search/:title", auctionController.getAuctionByTitle);
router.get("/edit/:id", auctionController.showEditAuction);

router.post("/create-auction", validators.validateAuction, auctionController.postAuction);

router.post("/auctions/search", auctionController.getAuctionByTitle);
// router.post("/auctions/:id", auctionController.updateAuctionDescription);

router.post("/edit-auction", auctionController.saveEdit);









module.exports = router;