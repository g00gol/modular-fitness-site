// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
// You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
import { ObjectId } from "mongodb";

/**
 *
 * @param  {...any} params
 */
export const invalidParams = (...params) => {
  for (let i in params) {
    if (typeof params[i] === "undefined" || params[i] === null) {
      throw [400, `Error: function parameter ${i} must have valid values`];
    }
  }
};

/**
 *
 * @param  {...any} strings
 * @usage inputs must be formatted as {varName: varValue}
 *
 */
export const invalidStrings = (...strings) => {
  for (let i in strings) {
    let [str] = Object.values(strings[i]);
    if (typeof str !== "string" || str.trim() === "") {
      let [field] = Object.keys(strings[i]);
      throw [400, `Error: ${field} must be a non-empty string`];
    }
  }
};

/**
 *
 * @param {...any} arrays
 * @usage inputs must be formatted as {varName: varValue}
 *
 */
export const invalidStrArrays = (...arrays) => {
  for (let i in arrays) {
    let [arr] = Object.values(arrays[i]);
    let [field] = Object.keys(arrays[i]);
    if (!Array.isArray(arr) || arr.length < 1) {
      throw [
        400,
        `Error: ${field} must be a valid array with at least one value`,
      ];
    }
    for (let j in arr) {
      let msg = `index ${j} of field ${field}`;
      let obj = {};
      obj[msg] = arr[j];
      invalidStrings(obj);
    }
  }
};

/**
 *
 * @param { id } string
 */
export const invalidID = (id) => {
  invalidParams(id);
  invalidStrings({ id: id });
  if (!ObjectId.isValid(id)) throw [400, "Error: id is not a valid ObjectId"];

  return id.trim();
};

/**
 *
 * @param {*} arr1
 * @param {*} arr2
 * @returns false if the two arrays are different and true otherwise
 */
export const arraysEqual = (arr1, arr2) => {
  // Check lengths
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Check if each element are the same
  for (let i in arr1) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

/**
 *
 * @param {object} band
 */
export const updateRating = (band) => {
  let sumRatings = 0;

  let albums = band.albums;
  for (let i in albums) {
    sumRatings += Number(albums[i].rating);
  }

  return Number((sumRatings / albums.length).toFixed(1));
};
