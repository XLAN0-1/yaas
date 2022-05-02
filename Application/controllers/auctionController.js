const currencyChange = require("../middleware/currencyChange");
const fetch = require("node-fetch");

/////////////////////////////UTILITY FUNCTIONS///////////////
//Fetch user currency or use a default currency for the data
getCurrency = (req, alternateCurrency) => {
  return req.cookies["currency"] === undefined
    ? alternateCurrency
    : req.cookies["currency"];
};

//Parse the price data to a more readable format
formatData = (data, currency) => {
  data.forEach((auction) => {
    const newMinPrice = currencyChange.convertSellerCurrencyToUserCurrency(
      auction.minPrice,
      auction.currency,
      currency
    );
    auction.formattedPrice = newMinPrice.toLocaleString();
    auction.currency = currency;
  });
  return data;
};
/////////////////////////////////////////////////////////////

//get auction by id
getAuctionById = async (req, res) => {
  id = req.params.id;

  const url = `http://localhost:5050/id/${id}`;
  console.log(url);

  const data = await fetch(url)
    .then((response) => response.json())
    .then((text) => text.data);

  console.log(data);
  console.log("///////");
  //Format the data into a more readable format
  const userCurrency = getCurrency(req, "EUR");

  //Create object for winning bid and minimum price
  const sellingPriceObj = {
    price: data.minPrice,
    sellerCurrency: data.currency,
    userCurrency: userCurrency,
  };

  const winningBidObj = {
    sellerCurrency: data.currency,
    userCurrency: userCurrency,
  };

  //Wrap the code that finds th ewinning bid in a try and catch incase there's no current bid
  try {
    winningBidObj.price = data.bids.at(-1).bid;
  } catch (error) {
    //DO nothing
  }

  //Generate the minimum bid and seling price
  const { minimumPrice, winningBid } =
    currencyChange.generatePriceAndWinnningBidInUserCurrency(
      sellingPriceObj,
      winningBidObj
    );

  res.render("info", {
    auction: data,
    userCurrency: userCurrency,
    price: minimumPrice,
    winningBid: winningBid,
  });
};

//get active auctions then show the screen
getActiveAuctions = async (req, res) => {
  //Get the data from the API
  const data = await fetch("http://localhost:5050/auctions")
    .then((response) => response.json())
    .then((text) => text.data);

  console.log(data);
  console.log(typeof data);
  //Format the data in a more readable format
  const currency = getCurrency(req, "EUR");
  const formattedData = formatData(data, currency);

  //Render the main screen
  res.render("main", { auctions: formattedData });
};

//Fetch auction by title
getAuctionByTitle = async (req, res) => {
  title = req.body.query;

  //Get the data from the api
  const data = await fetch(`http://localhost:5050/auctions/${title}`)
    .then((response) => res.json())
    .then((text) => text.data);

  //Parse the data in a readable format
  const userCurrency = getCurrency(req, "EUR");
  const formattedData = formatData(data, userCurrency);

  res.render("search", { auctions: formattedData });
};

//Get the bid history for a particular auction
getBidHistory = async (req, res) => {
  id = req.params.id;
  let auctionCurrency = "EUR";

  //Fetch data from API
  const data = await fetch(`http://localhost:5050/${id}/bids`)
    .then((response) => response.json())
    .then((text) => {
      auctionCurrency = text.currency;
      return text.data;
    });

  //Parse the data
  const userCurrency = getCurrency(req, "EUR");

  data.forEach((item) => {
    item.bid = currencyChange
      .convertSellerCurrencyToUserCurrency(
        item.bid,
        auctionCurrency,
        userCurrency
      )
      .toLocaleString();
  });

  //Render the page
  res.render("bidHistory", { bids: data, currency: userCurrency });
};

//post auction
postAuction = async (req, res) => {
  console.log("This was called");
  //The data is going to be passed to the API
  const userCurrency = getCurrency(req, "EUR");

  console.log(req.auctionTitle);
  console.log(req.auctionDescription);

  let body = {
    sellerName: req.cookies["name"],
    sellerEmail: req.cookies["id"],
    currency: userCurrency,
    title: req.auctionTitle,
    description: req.auctionDescription,
    minPrice: req.auctionMinPrice,
    deadline: req.auctionDeadline,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams(body),
  };

  const response = await fetch("http://localhost:5050/auction", options)
    .then((response) => response.text())
    .then((text) => text);

  if (response === "Auction added") {
    res.redirect("/verify-auction");
  }
};

//Route to show conifrm auction page
showConfirmAuction = (req, res) => {
  console.log("This was called");
  res.render("confirmAuction");
};

//Route to show postAuction page
showCreateAuction = (req, res) => {
  //If there was an error pass the exisitng values to the template so user doesn't have to type again
  const error = req.cookies["auction_error"];
  const title = req.cookies["auction-title"];
  const description = req.cookies["auction-description"];
  const price = req.cookies["auction-price"];
  const deadlineDate = req.cookies["auction-deadline-date"];
  const deadlineTime = req.cookies["auction-deadline-time"];

  //Clear the cookies
  res.clearCookie("auction_error");
  res.clearCookie("auction-title");
  res.clearCookie("auction-description");
  res.clearCookie("auction-price");
  res.clearCookie("auction-deadline-date");
  res.clearCookie("auction-deadline-time");

  //Render the page
  res.render("postAuction", {
    error: error,
    title: title,
    description: description,
    price: price,
    deadlineDate: deadlineDate,
    deadlineTime: deadlineTime,
  });
};

//confirm posting auction
confirmAuction = async (req, res) => {
  console.log("This page was called");
  const id = req.params.id;
  const data = await fetch(`http://localhost:5050/confirm/${id}`)
    .then((response) => response.text())
    .then((text) => text);

  if (data === "ok") {
    res.redirect("/");
  }
};

//show edit auction
showEditAuction = async (req, res) => {
  const id = req.params.id;

  const url = `http://localhost:5050/id/${id}`;

  const data = await fetch(url)
    .then((response) => response.json())
    .then((text) => text.data);

  res.render("edit", { description: data.description, id: data._id });
};

saveEdit = async (req, res) => {
  //USE THE API TO SAVE THE EDIT
  const url = "http://localhost:5050/update";

  const body = {
    id: req.body.id,
    description: req.body.description,
  };

  const options = {
    method: "PATCH",
    body: new URLSearchParams(body),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  };

  const result = await fetch(url, options)
    .then((response) => response.text())
    .then((text) => text);

  console.log(result);
  if (result === "Auction updated") {
    res.redirect("/account");
  }
};

/************************************************************************************ */

module.exports = {
  postAuction,
  getAuctionById,
  getAuctionByTitle,
  confirmAuction,
  getActiveAuctions,
  getBidHistory,
  showCreateAuction,
  showConfirmAuction,
  showEditAuction,
  saveEdit,
};
