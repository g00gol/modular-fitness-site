/**
 * Checks if a param is a non-empty string that is between 1 and 200 characters
 * @param {*} param
 * @returns {boolean} True if param is a non-empty string, false otherwise
 */
export function isString(param) {
  return (
    typeof param === "string" &&
    param.trim().length > 0 &&
    param.trim().length <= 200
  );
}

/**
 * Check if the parameters exist
 * @param {object} obj An object of parameters whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
export function paramExists(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (
      typeof obj[key] === "undefined" ||
      obj[key] === null ||
      obj[key] === ""
    ) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}

/**
 * Checks if the parameters are all existing strings
 * @param {object} obj An object of parameters whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
export function paramIsString(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (!isString(obj[key])) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}

/**
 * Checks if the parameters are all valid numbers
 * @param {object} obj An object of parameters whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
export function paramIsNum(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (isNaN(obj[key])) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}

/**
 * Checks if the parameters are all valid arrays
 * @param {*} obj An object of parameters whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
export function paramIsArray(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (!Array.isArray(obj[key])) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}

/**
 * Checks if the parameters are valid dates
 * @param {object} obj An object of a user's date of birth whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
export function paramIsDate(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (
      typeof obj[key] === "undefined" ||
      obj[key] === null ||
      !isString(obj[key]) ||
      !moment(obj[key], "YYYY-MM-DD", true).isValid() // date is not valid
    ) {
      invalidParams.push(key);
    }
  }
  if (invalidParams.length > 0) throw invalidParams;
}
