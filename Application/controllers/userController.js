const { Users } = require("../DB/model.js");
const data = require("../currencyData");
const bcrypt = require("bcrypt");

const saltRounds = 5;

//User is trying to login
loginUser = (req, res) => {
  console.log("Login user was called");
  const userEmail = req.userEmail;
  const password = req.password;

  console.log(`Login user email is: '${userEmail}'`);
  console.log(`Login user password is ${password}`);

  //Find the user with this email
  Users.findOne({ email: userEmail }, (err, user) => {
    if (!err) {
      //Check if this email doesn't exist
      if (user === "undefined" || user === null) {
        //Email doesn't exist
        res.cookie("login_error", "Email doesn't exist");
        res.cookie("email", userEmail);
        res.redirect("/login");
      } else {
        bcrypt.compare(password, user.password).then((result) => {
          if (result) {
            //TODO direct user to the main page
            //Store some useful user data in cookies
            res.cookie("id", userEmail);
            res.cookie("currency", user.currency);
            res.cookie("name", user.fullName);
            res.redirect("/");
          } else {
            //Password's don't match
            //TODO notify the user that the passwor is incorrect
            res.cookie("login_error", "Incorrect Password");
            res.cookie("email", userEmail);
            res.redirect("/login");
          }
        });
      }
    }
  });
};

//User is trying to create an account
createAccount = (req, res) => {
  console.log("Create account called");
  console.log("Model is " + Users);
  userEmail = req.body.userEmail;
  fullName = req.body.fullName;
  currency = req.body.currency;
  password = req.body.password;

  console.log(userEmail + fullName + currency+ password);
  //Hash the password then save the user
  bcrypt.hash(password, saltRounds).then((hash) => {
    //Check if the email already exists, if it doesn't create a new user with the email, but if it exists
    //tell the user that the email already exists
    console.log("One level deep");
    Users.findOne({ email: userEmail }, (err, result) => {
      console.log("Two level deep");
      if (!err) {
        if (result === "undefined" || result === null) {
          //Email doesn't exist so create a new user
          const user = new Users({
            email: userEmail,
            fullName: fullName,
            currency: currency,
            password: hash,
          });
          user.save((err) => {
            if (!err) {
              console.log("User was saved");
              //TODO Redirect the user to the home screen
              res.cookie("id", userEmail);
              res.cookie("currency", currency);
              res.cookie("name", fullName);
            
              res.redirect("/");
            }
          });
        } else {
          //Email already exists
          //TODO notify the user that the email already exists
          res.cookie("register_error", "Email already exists");
          res.cookie("email", userEmail);
          res.cookie("name", fullName);
          res.cookie("currency", currency);
          res.redirect("/register");
        }
      }
    });
  });
};

//show login view
showLogin = (req, res) => {
  //If there was an error pass the exisitng values to the template so user doesn't have to type again\\
  console.log("Login is showing");
  const error = req.cookies["login_error"];
  const email = req.cookies["email"];

  //Clear the cookies
  res.clearCookie("login_error");
  res.clearCookie("email");
  res.render("login", { error: error, email: email });
};

//show register view
showRegister = (req, res) => {
  //If there was an error pass the exisitng values to the template so user doesn't have to type again
  const error = req.cookies["register_error"];
  const email = req.cookies["email"];
  const name = req.cookies["name"];
  const currency = req.cookies["currency"];

  //Clear the cookies
  res.clearCookie("email");
  res.clearCookie("name");
  res.clearCookie("currency");
  res.clearCookie("register_error");
  res.clearCookie("email");
  res.render("register", {
    currencies: data.currencies,
    error: error,
    email: email,
    name: name,
    currency: currency,
  });
};

logOut = (req, res)=>{
  res.clearCookie("id");
  res.clearCookie("currency")
  res.clearCookie("name");
  res.redirect("/");
}

module.exports = {
  loginUser,
  createAccount,
  showLogin,
  showRegister,
  logOut
};
