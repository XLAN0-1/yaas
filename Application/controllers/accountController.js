const bcrypt = require("bcrypt");
const saltRounds = 5;
const data = require("../currencyData");
const { Users } = require("../DB/model.js");
const fetch = require("node-fetch");
const { isValidPassword } = require("../controllers/validators");

//Update the cookies
updateCookies = (res, email, currency) => {
  res.cookie("id", email);
  res.cookie("currency", currency);
};

//Function to change user email
changeDetails = async (req, res) => {
  const oldEmail = req.cookies["id"];
  newEmail = req.body.email;
  newPassword = req.body.password;
  newCurrency = req.body.userCurrency;

  if (newPassword === undefined || newPassword.length === 0) {
    //User isn't trying to change their password
    console.log("I'm not trying to change password");

    //Check if there's an email existing with the new email
    Users.findOne({ email: newEmail }).then((result) => {
      if (result === "undefined" || result === null) {
        //Email doesn't exist so do the update
        Users.updateOne(
          { email: oldEmail },
          { email: newEmail, currency: newCurrency }
        ).then((result) => {
          //Update the cookies then redirect to  account
          updateCookies(res, newEmail, newCurrency);
          res.redirect("/account");
        });
      } else {
        res.cookie("account_error", "Email already exists");
        res.redirect("/edit-account");
      }
    });
  } else {
    //User is trying to change their password too so first check if it's a valid password
    if (isValidPassword(newPassword)) {
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      // Check if user is only trying to change their password
      if (oldEmail === newEmail) {
        //User only wants to change password
        Users.updateOne(
          { email: oldEmail },
          { password: hashedPassword, currency: newCurrency }
        ).then((result) => {
          updateCookies(res, oldEmail, newCurrency);
          res.redirect("/account");
        });
      } else {
        //Check if there's an email existing with the new email
        Users.findOne({ email: newEmail }).then((result) => {
          if (result === "undefined" || result === null) {
            //Email doesn't exist so do the update
            Users.updateOne(
              { email: oldEmail },
              {
                email: newEmail,
                currency: newCurrency,
                password: hashedPassword,
              }
            ).then((result) => {
              //Update the cookies then redirect to  account
              updateCookies(res, newEmail, newCurrency);
              res.redirect("/account");
            });
          } else {
            res.cookie("account_error", "Email already exists");
            res.redirect("/edit-account");
          }
        });
      }
    } else {
      res.cookie("account_error", "Password must be longer than 6 characters");
      res.redirect("/edit-account");
    }
  }
};

//Show account
getAccount = async (req, res) => {
  const email = req.cookies["id"];
  //Fetch all auctions posted on this account
  const url = `http://localhost:5050/user/${email}`;

  const data = await fetch(url)
    .then((response) => response.json())
    .then((text) => text.data);

  console.log(data);

  const currency = req.cookies["currency"];
  const error = req.cookies["account-error"];
  res.clearCookie("account-error");

  res.render("account", {
    auctions: data,
  });
};

//Show edit account
editAccount = (req, res) => {
  const email = req.cookies["id"];
  const currency = req.cookies["currency"];

  const error = req.cookies["account_error"];
  res.clearCookie("account_error");
  res.render("editAccount", {
    email: email,
    currencies: data.currencies,
    currency: currency,
    error: error,
  });
};

module.exports = {
  getAccount,
  changeDetails,
  editAccount,
};
