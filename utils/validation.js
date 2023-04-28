import moment from "moment";

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
 * Checks if the parameteres are existing strings that are between 2 and 25 characters and tests against a regex for internation names
 * @param {object} obj An object of a user's full name whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
function authFullName(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (
      typeof obj[key] === "undefined" ||
      obj[key] === null ||
      !stringBool(obj[key]) ||
      obj[key].length < 2 ||
      obj[key].length > 25 ||
      !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(
        obj[key]
      )
    ) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}

/**
 * Checks if the parameteres are existing strings that are 5 to 25 characters
 * @param {object} obj An object of a user's username whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
function authUsername(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (
      typeof obj[key] === "undefined" ||
      obj[key] === null ||
      !stringBool(obj[key]) ||
      obj[key].length < 5 ||
      obj[key].length > 25
    ) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}

/**
 * Checks if the parameter is a valid email
 * @param {object} obj An object of emails whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
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

/**
 * Checks if the parameter is a valid date of birth in the format YYYY-MM-DD, later than 01/01/1900,
 * not in the future, and that the user's age is >13 using moment
 * @param {object} obj An object of a user's date of birth whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
function authDOB(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (
      typeof obj[key] === "undefined" ||
      obj[key] === null ||
      !stringBool(obj[key]) ||
      !moment(obj[key], "YYYY-MM-DD", true).isValid() || // date is not valid
      moment(obj[key]).isAfter(moment()) || // date is in the future
      moment(obj[key]).isBefore(moment("1900-01-01")) || // date is before 1900
      moment().diff(moment(obj[key]), "years") < 13 // user is less than 13 years old
    ) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}

export {
  stringBool,
  authParam,
  authFullName,
  authUsername,
  authEmail,
  authPassword,
  authDOB,
};
