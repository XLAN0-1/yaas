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