const fetch = require("node-fetch"); 

//Fetch user currency or use a default currency for the data
getCurrency = (req, alternateCurrency) => {
  return req.cookies["currency"] === undefined
    ? alternateCurrency
    : req.cookies["currency"];
};

//post new bid
postNewBid = async (req, res) => {

  const url = "http://localhost:5050/bid";
  const userCurrency = getCurrency(req, "EUR");

  const body = {
    id: req.body.id,
    userEmail: req.cookies["id"],
    bid: req.body.bid,
    currency: userCurrency
  };

  const options = {
    method: "POST",
    body: new URLSearchParams(body),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  }

  const result = await fetch(url, options)
  .then(response => response.text())
  .then(text => text);


  res.send(result);


};

module.exports = {
  postNewBid,
};
