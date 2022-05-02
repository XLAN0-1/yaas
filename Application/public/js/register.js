//Currency selected
currenyChanged = () => {
  const currency = document.querySelector(".currency-field").value;
  document.querySelector(".form-currency").value = currency;
};

//Event listener for when the user changes currency
document
  .querySelector(".currency-field")
  .addEventListener("change", currenyChanged);

console.log("Just let's be connected");

//On-click listener to toggle password
function myFunction() {
  var passwordField = document.getElementById("password-field");
  if (passwordField.type === "password") {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
}

document
  .querySelector(".password-checkbox")
  .addEventListener("click", myFunction);
