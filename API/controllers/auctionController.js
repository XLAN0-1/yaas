const { Auctions } = require("../DB/model");
const sendMessage = require("./emailController");

//get auction by id
getAuctionById = (req, res) => {
  id = req.params.id;

  console.log("This guy was called with id of " + id);

  Auctions.findById({ _id: id })
    .then((auction) => {
      res.status(200).json({
        data: auction,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

//get all auctions
getAllAuctions = (req, res) => {
  Auctions.find()
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

//Get active auctions
getActiveAuctions = (req, res) => {
  Auctions.find({ isActive: true, isConfirmed: true, isBanned: false })
    .sort({ _id: -1 })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send(error);
    });
};

//get auction by title
getAuctionByTitle = (req, res) => {
  title = req.body.query;
  console.log(title);
  Auctions.find({
    title: { $regex: title },
    isActive: true,
    isConfirmed: true,
    isBanned: false,
  })
    .limit(20)
    .then((result) => {
      res.status(200).res.json({
        data: resul,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

//post auction
postAuction = (req, res) => {
  sellerName = req.body.sellerName;
  sellerEmail = req.body.sellerEmail;
  currency = req.body.currency;
  title = req.body.title;
  description = req.body.description;
  minPrice = req.body.minPrice;
  deadline = req.body.deadline;
  test = req.body.test !== undefined ? true : false;

  const auction = new Auctions({
    sellerName: sellerName,
    sellerEmail: sellerEmail,
    title: title,
    description: description,
    currency: currency,
    minPrice: minPrice,
    deadline: deadline,
    isActive: true,
    isConfirmed: false,
    isBanned: false,
    test: test,
  });

  //After saving the auction, send a confirmation email to the seller
  auction
    .save()
    .then((auction) => {
      //Only send a mail when this is not a tets
      if (!auction.test) {
        sendMessage.sendConfirmationMail(
          sellerEmail,
          auction.sellerName,
          auction.title,
          auction._id
        );
      }
      res.status(200).send("Auction added");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

//update auction description
updateAuctionDescription = (req, res) => {
  id = req.body.id;
  description = req.body.description;

  Auctions.findOneAndUpdate({ _id: id }, { description: description })
    .then((result) => {
      res.status(200).send("Auction updated");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

//get user auction
getUserAuctions = (req, res) => {
  const email = req.params.email;

  Auctions.find({ sellerEmail: email })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

//Get the bid history for a particular auction
getBidHistory = (req, res) => {
  id = req.params.id;

  Auctions.findById({ _id: id })
    .then((result) => {
      //Convert all bids from seller currency to user currency
      bids = result.bids.reverse();
      res.status(200).json({
        data: bids,
        currency: result.currency,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

//confirm posting auction
confirmAuction = (req, res) => {
  const id = req.params.id;
  Auctions.findOneAndUpdate({ _id: id }, { isConfirmed: true }).then(
    (result) => {
      res.status(200).send("ok");
    }
  );
};

//Create a function that keeps checking if an auction is resolved
resolveAuctions = async (req, res) => {
  console.log("I was called");
  //First find the auctions before updating it so we can have access to the data
  await Auctions.find({
    isConfirmed: true,
    isBanned: false,
    isActive: true,
    deadline: { $lt: new Date() },
  })
    .then((result) => {
      console.log(result);
      result.forEach((auction) => {
        if (!auction.test) {
          sendMessage.sendAuctionHasEndedMail(auction);
        }
      });
    })
    .catch((error) => console.log(error));

  Auctions.updateMany(
    {
      isActive: true,
      deadline: { $lt: new Date() },
    },
    { isActive: false }
  ).then((result) => console.log(result));
};

module.exports = {
  getBidHistory,
  updateAuctionDescription,
  getAuctionById,
  getAuctionByTitle,
  getAllAuctions,
  getActiveAuctions,
  postAuction,
  confirmAuction,
  getUserAuctions,
  resolveAuctions,
};
