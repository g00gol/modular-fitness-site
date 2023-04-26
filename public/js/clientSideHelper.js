// helper functions for the client side js
/**
 * Checks if the input is a valid string (trims whitespace and checks length)
 * @param {string} str A string
 * @throws {boolean} A boolean for whether the string is valid
 */
function stringBool(str) {
  return typeof str === "string" && str.trim().length > 0;
}

/**
 * Checks if the parameters are all existing strings
 * @param  {object} obj An object whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
function authParam(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (
      typeof obj[key] === "undefined" ||
      obj[key] === null ||
      !stringBool(obj[key])
    ) {
      invalidParams.push(key);
    }
  }
  // console.log("invalid params:", invalidParams);
  if (invalidParams.length > 0) throw invalidParams;
}

/**
 * Checks if the parameteres are existing strings that are between 2 and 25 characters and tests against a regex (/^[a-z ,.'-]+$/i)
 * @param {object} obj An object of a user's name whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
function authName(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (
      typeof obj[key] === "undefined" ||
      obj[key] === null ||
      !stringBool(obj[key]) ||
      obj[key].length < 2 ||
      obj[key].length > 25 ||
      !/^[a-z,.'-]+$/i.test(obj[key])
    ) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}

/**
 * Checks if password and confirmPassword is a valid string with a minimum of 8 characters. There needs to be at least one uppercase character, at least one number, at least one special character
 * Also checks if the password is the same as confirmPassword
 * @param {string} password A password string
 * @param {string} confirmPassword A password string
 * @throws {array} An array of which parameters are invalid
 */
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

function authEmail(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (
      typeof obj[key] === "undefined" ||
      obj[key] === null ||
      !stringBool(obj[key]) ||
      // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
      !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        obj[key]
      )
    ) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}
export { stringBool, authParam, authName, authEmail, authPassword };
