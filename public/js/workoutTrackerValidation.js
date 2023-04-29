/**
 * Checks if a param is a non-empty string
 * @param {*} param
 * @returns {boolean} True if param is a non-empty string, false otherwise
 */
export function isString(param) {
  return typeof param === "string" && param.trim().length > 0;
}

/**
 * Check if the parameters exist
 * @param {object} obj An object of parameters whose key is the name of the parameter and the value is the value of the parameter
 * @throws {array} An array of which parameters are invalid
 */
export function paramExists(obj) {
  let invalidParams = [];
  for (let key in obj) {
    if (typeof obj[key] === "undefined" || obj[key] === null) {
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