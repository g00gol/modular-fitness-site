//JQuery here
import * as validation from "./clientSideHelper.js";

//signup form's id = registration-form
// username input's id = usernameInput
//password input's id = passwordInput
// retyed password's id = retypePasswordInput
function registrationValidation() 
{
    console.log("Listening to registration form");








    

}  






//login form's id = login-form
//login form username input's id = userNameInput
// login form password input's id = passwordInput
function loginValidation() {
    console.log("Listening to login form");








}  


document.addEventListener("DOMContentLoaded", () => {
    // Check which form is being displayed
    if ($("#registration-form").length > 0) {
      registrationValidation();
    } else if ($("#login-form").length > 0) {
      loginValidation();
    }
  });
  