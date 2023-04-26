// helper functions for the client side js
function authPassword(password, confirmPassword) {
    let invalidParams = [];
    if (
      typeof password === "undefined" ||
      password === null ||
      !stringBool(password) ||
      password.length < 8 ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(password)
    ) {
      invalidParams.push("passwordInput");
    }
    if (
      typeof confirmPassword === "undefined" ||
      confirmPassword === null ||
      !stringBool(confirmPassword) ||
      confirmPassword.length < 8 ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(
        confirmPassword
      ) ||
      password !== confirmPassword
    ) {
      invalidParams.push("confirmPasswordInput");
    }
    if (invalidParams.length > 0) throw invalidParams;
  }
  
  function emailValidation (email)
  {
      if(!email)
      {
          return false;
      }
      if (typeof email != 'string' || email.trim().length === 0)
      {
          return false;
      }
      if(!(/^[a-zA-Z0-9.!#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)))
      {
          return false;
      } // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
      return true;
  }
  export { emailValidation, authPassword };