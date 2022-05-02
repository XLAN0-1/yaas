const res = require("express/lib/response");
const validator = require("validator");

//Check if a field is blank
isBlank = (input) => {
  if (input === undefined || input.length === 0) {
    return true;
  } else {
    return false;
  }
};

isValidPassword = (password) => {
  return password.length > 6;
};

validateLogin = (req, res, next) => {
  const userEmail = req.body.userEmail;
  const password = req.body.password;

  //Check if all fields are not blank
  if (isBlank(userEmail) || isBlank(password)) {
    //A Field is blank is the error message
    res.cookie("login_error", "No field must be blank");
    res.cookie("email", userEmail);
    res.redirect("/login");
  } else {
    //No field was blank so check if the email is valid
    if (validator.isEmail(userEmail)) {
      //Email is valid so check if the password is valid
      if (isValidPassword(password)) {
        //Password is valid do the login by calling next and pass the variables
        req.userEmail = userEmail;
        req.password = password;
        next();
      } else {
        //Password isn't valid mehn
        res.cookie("login_error", "Password must be longer than 6 characters.");
        res.cookie("email", userEmail);
        res.redirect("/login");
      }
    } else {
      //Email isn't valid
      res.cookie("login_error", "Invalid email.");
      res.cookie("email", userEmail);
      res.redirect("/login");
    }
  }
};

validateSignUp = (req, res, next) => {
  userEmail = req.body.userEmail;
  fullName = req.body.fullName;
  password = req.body.password;
  currency = req.body.userCurrency ;

  if (isBlank(userEmail) || isBlank(fullName)) {
    //User name or email is blank
    res.cookie("register_error", "No field must be blank");
    res.cookie("email", userEmail);
    res.cookie("name", fullName);
    res.cookie("currency", currency);
    res.redirect("/register");
  } else {
    //User field or email isn't blank
    if (validator.isEmail(userEmail)) {
      //Valid email
      if (isValidPassword(password)) {
        //Password is valid so do the login
        req.userEmail = userEmail;
        req.fullName = fullName;
        req.password = password;
        req.currency = currency;
        next();
      } else {
        //Password is invalid
        res.cookie(
          "register_error",
          "Password must be longer than 6 characters"
        );
        res.cookie("email", userEmail);
        res.cookie("name", fullName);
        res.cookie("currency", currency);
        res.redirect("/register");
      }
    } else {
      //Invalid email
      res.cookie("register_error", "Invalid email");
      res.cookie("email", userEmail);
      res.cookie("name", fullName);
      res.cookie("currency", currency);
      res.redirect("/register");
    }
  }
};

authenticateUser = (req, res, next) => {
  const id = req.cookies["id"];
  if (id === undefined || id === null) {
    next();
  } else {
    res.redirect("/");
  }
};

//Check if the user is signed in by checking if they have an email stored in cookie
userIsSignedIn = (req, res, next) => {
  const id = req.cookies["id"];
  if (id === undefined || id === null) {
    res.redirect("/login");
  } else {
    next();
  }
};

deadlineDateIsValid = (deadlineDate) => {
  //Check if the deadline date is at least 72hrs in the future
  return new Date(deadlineDate) - new Date() > 259200000;
};

parseDateAndTime = (date, time) => {
  return `${date}T${time}`;
};

//Send error message for validateAuction
sendAuctionErrorMessage = (
  res,
  error,
  title,
  description,
  price,
  deadlineDate,
  deadlineTime
) => {
  //Send a message that no field must be blank
  res.cookie("auction_error", error);

  //Pass the old data so the user wont't have to type everythin again
  res.cookie("auction-title", title);
  res.cookie("auction-description", description);
  res.cookie("auction-price", price);
  res.cookie("auction-deadline-date", deadlineDate);
  res.cookie("auction-deadline-time", deadlineTime);

  //Redirect to the create-auction page
  res.redirect("/create-auction");
};


//Check if the user is the admin
userIsAdmin = (req, res, next)=>{
  const userEmail = req.cookies["id"];
  if(userEmail === "admin@admin.com"){
    //User is admin
    next();
  }else{
    //User is not the admin
    res.redirect("/");
  }
}


validateAuction = (req, res, next) => {
  //First verify that no major field is blank
  const auctionTitle = req.body.title;
  const auctionDescription = req.body.description;
  const auctionMinPrice = req.body.minPrice;
  const auctionDeadlineDate = req.body.deadline;
  const auctionDeadlineTime = req.body.deadlineTime;

  console.log(auctionDescription);

  if (
    isBlank(auctionTitle) ||
    isBlank(auctionDescription) ||
    isBlank(auctionMinPrice) ||
    isBlank(auctionDeadlineDate) ||
    isBlank(auctionDeadlineTime)
  ) {
    sendAuctionErrorMessage(
      res,
      "No field should be blank",
      auctionTitle,
      auctionDescription,
      auctionMinPrice,
      auctionDeadlineDate,
      auctionDeadlineTime
    );
  } else {
    //No field is blank so check if the date is a valid date
    const parsedDate = parseDateAndTime(
      auctionDeadlineDate,
      auctionDeadlineTime
    );
    if (deadlineDateIsValid(parsedDate)) {
      //Date is valid so post the auction
      req.auctionTitle = auctionTitle;
      req.auctionDescription = auctionDescription;
      req.auctionMinPrice = auctionMinPrice;
      req.auctionDeadline= parsedDate;
      

      next();
    } else {
      //Date is invalid so notify the user that the auction's minimum time is 72hrs
      sendAuctionErrorMessage(
        res,
        "Minimum time for an auction is 72hrs",
        auctionTitle,
        auctionDescription,
        auctionMinPrice,
        auctionDeadlineDate,
        auctionDeadlineTime
      );
    }
  }
};

module.exports = {
  validateLogin,
  validateSignUp,
  authenticateUser,
  userIsSignedIn,
  validateAuction,
  userIsAdmin,
  isValidPassword
};
