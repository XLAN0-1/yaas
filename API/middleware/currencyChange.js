const { data } = require("../currencyData");

convertSellerCurrencyToUserCurrency = (
  amount,
  sellerCurrency,
  userCurrency
) => {
  sellerCurrencyRate = data.rates[sellerCurrency];
  userCurrencyRate = data.rates[userCurrency];

  return ((amount / sellerCurrencyRate) * userCurrencyRate);
};

convertUserCurrencyToSellerCurrency = (
  amount,
  sellerCurrency,
  userCurrency
) => {
  sellerCurrencyRate = data.rates[sellerCurrency];
  userCurrencyRate = data.rates[userCurrency];

  return ((amount / userCurrencyRate) * sellerCurrencyRate);
};

generatePriceAndWinnningBidInUserCurrency = (
  sellingPriceObj,
  winningBidObj
) => {
  const minimumPrice = convertSellerCurrencyToUserCurrency(
    sellingPriceObj.price,
    sellingPriceObj.sellerCurrency,
    sellingPriceObj.userCurrency
  );

  var winningBid;
  //Do the check for the winning bid
  if (
    winningBidObj.price === undefined ||
    winningBidObj.price === "undefined"
  ) {
    winningBid = "-";
  } else {
    winningBid = convertSellerCurrencyToUserCurrency(
      winningBidObj.price,
      winningBidObj.sellerCurrency,
      winningBidObj.userCurrency
    );
  }
  return { minimumPrice: minimumPrice.toLocaleString(), winningBid: winningBid.toLocaleString()};
};

module.exports = {
  convertSellerCurrencyToUserCurrency,
  convertUserCurrencyToSellerCurrency,
  generatePriceAndWinnningBidInUserCurrency,
};
