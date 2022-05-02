const { Auctions } = require("../DB/model");
const sendMessage = require("./emailController");

const currencyChange = require("../middleware/currencyChange");

//Check if a bid is valid, bids must be incremented by at least 0.01 and be greater than the minimum price
isValidBid = (minimumPrice, previousBid, newBid) => {
  if (newBid > minimumPrice && newBid / previousBid > 1.01) {
    return true;
  } else {
    return false;
  }
};

//Function to first check if a user can bid by checking if the user isn't the seller
userCanBid = (req, res, next) => {
  const id = req.body.id;
  const bidderEmail = req.body.userEmail;
  const bid = req.body.bid;
  const userCurrency = req.body.currency;

  //Find the current bid item and verify if the user can bid on the item
  Auctions.findOne({ _id: id })
    .then((result) => {
      if (result.sellerEmail === bidderEmail) {
        res.status(200).send("You cant't bid on your own auction.");
        // return false;
      } else {
        req.id = id;
        req.bid = bid;
        req.currency = userCurrency;
        req.bidderEmail = bidderEmail;
        next();
        // return true;
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

//post new bid
postNewBid = (req, res) => {
  const id = req.id;
  const bid = req.bid;
  const userCurrency = req.currency;
  const bidderEmail = req.bidderEmail;

  Auctions.findById({ _id: id })
    .then((auction) => {
      console.log("Auction found");
      //Convert the user's bid to the seller's currency
      bidInSellerCurrency = currencyChange.convertUserCurrencyToSellerCurrency(
        bid,
        auction.currency,
        userCurrency
      );

      var currentHighestBid;
      var currentHighestBidObject;

      try {
        currentHighestBidObject = auction.bids.at(-1);
        currentHighestBid = currentHighestBidObject["bid"];
      } catch (error) {
        currentHighestBid = 1;
      }

      if (
        isValidBid(auction.minPrice, currentHighestBid, bidInSellerCurrency)
      ) {
        //TODO Put the proper details to send the mail to
        auction.bids.push({
          email: bidderEmail,
          bid: bidInSellerCurrency,
        });

        //Send an email only if it's not a test
        if (!auction.test) {
          console.log("This is not a test")
          //Send latest bidder mail that someone else has a higher bid
          if (currentHighestBidObject !== undefined) {
            sendMessage.sendLatestBidderMail(
              currentHighestBidObject.email,
              auction.title
            );
          }

          // Send the seller a mail that someone has made a bid
          sendMessage.sendSellerBidMail(
            auction.sellerEmail,
            bidderEmail,
            auction.title,
            bidInSellerCurrency.toLocaleString(),
            auction.currency
          );
        }else{
          console.log("This is a test");
        }
        res.status(200).send("Your bid is valid");
        console.log("Your bid is valid");
      } else {
        //Current bid is not valid;
        res.status(200).send("Your bid is invalid");
        console.log("Your bid is invalid");
      }
      //Save the new bid
      auction.save();
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

module.exports = {
  userCanBid,
  postNewBid,
};
