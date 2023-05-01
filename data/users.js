import bcrypt from "bcrypt";
import { users } from "../config/mongoCollections.js";

import * as validation from "../utils/validation.js";

/**
 * Creates a new user using the following fields:
 * @param {string} fullName
 * @param {string} username
 * @param {string} password
 * @param {string} confirmPassword
 * @param {string} DOB - Format: YYYY-MM-DD
 * @returns {insertedUser: true} if the user was successfully inserted
 * @throws {array} of invalid parameters if there are any invalid parameters
 */
export const createUser = async (
  fullName,
  username,
  password,
  confirmPassword,
  DOB
) => {
  // Check if parameters exists
  try {
    validation.authParam({
      fullNameInput: fullName,
      usernameInput: username,
      passwordInput: password,
      confirmPasswordInput: confirmPassword,
      DOBInput: DOB,
    });
  } catch (e) {
    throw e;
  }

  /**
   * An array of invalid parameters which is checked later on
   * Each check must be mutually exclusive
   */
  let invalidParams = [];

  // Validate full name
  try {
    validation.authFullName({
      fullNameInput: fullName,
    });
  } catch (e) {
    // Add the invalid parameters array to the invalidParams array
    invalidParams = [...invalidParams, ...e];
  }

  // Validate username
  try {
    validation.authUsername({ usernameInput: username });
  } catch (e) {
    // Add the invalid parameters array to the invalidParams array
    invalidParams = [...invalidParams, ...e];
  }

  // Validate passwordInput and confirmPasswordInput
  try {
    validation.authPassword(password, confirmPassword);
  } catch (e) {
    // Add the invalid parameters array to the invalidParams array
    invalidParams = [...invalidParams, ...e];
  }

  try {
    validation.authDOB({ DOBInput: DOB });
  } catch (e) {
    // Add the invalid parameters array to the invalidParams array
    invalidParams = [...invalidParams, ...e];
  }

  // Check if there are any invalid parameters
  if (invalidParams.length > 0) {
    throw { invalid: invalidParams };
  }

  // Otherwise, proceed to create the user
  /**
   * Format the inputs
   */
  fullName = fullName.trim();
  username = username.toLowerCase().trim();

  // Hash the password
  let hashedPassword = await bcrypt.hash(password, 10);
  // Create the user object
  let newUser = {
    fullName,
    username,
    password: hashedPassword,
    DOB,
    enabledModules: [],
  };

  const usersCollection = await users();
  // Check if the user already exists
  let user = await usersCollection.findOne({ username });
  if (user) throw { alreadyExists: true };

  // Insert the user into the database
  let createInfo = await usersCollection.insertOne(newUser);

  // Check if the user was successfully inserted
  if (!createInfo.acknowledged || !createInfo.insertedId)
    throw { serverError: [500, "Internal Server Error"] };

  return { insertedUser: true };
};

/**
 * Checks if the user data is correct
 * @param {string} username
 * @param {string} password
 * @returns the user data if the user was successfully authenticated
 * @throws {array} of invalid parameters if there are any invalid parameters
 */
export const checkUser = async (username, password) => {
  // Validate the username and password
  try {
    validation.authParam({ username, password });
  } catch (e) {
    throw e;
  }

  /**
   * An array of invalid parameters which is checked later on
   * Each check must be mutually exclusive
   */
  let invalidParams = [];

  // Validate username
  try {
    validation.authUsername({ usernameInput: username });
  } catch (e) {
    // Add the invalid parameters array to the invalidParams array
    invalidParams = [...invalidParams, ...e];
  }

  // Validate password
  try {
    validation.authPassword(password, password);
  } catch (e) {
    // Add the invalid parameters array to the invalidParams array
    invalidParams = [...invalidParams, ...e];
  }

  // Check if there are any invalid parameters
  if (invalidParams.length > 0) {
    throw { invalid: invalidParams };
  }

  username = username.toLowerCase().trim();

  // Try to find the user by username
  const usersCollection = await users();
  let user;
  try {
    user = await usersCollection.findOne({ username });
  } catch (e) {
    throw { serverError: [500, "Internal Server Error"] };
  }

  // Check if user was found with the username
  if (user) {
    // Check if the password is correct
    let match = await bcrypt.compare(password, user.password);
    if (match) {
      return {
        uid: user._id.toString(),
        fullName: user.fullName,
        username: user.username,
        enabledModules: user.enabledModules,
      };
    }
  }

  // Else case
  throw { error: ["Username or password is incorrect"] };
};

/**
 * Gets the user by username
 * @param {*} username
 * @returns the user data if the user was successfully found
 * @throws {array} of invalid parameters if there are any invalid parameters
 */
export const getByUsername = async (username) => {
  try {
    validation.authParam({ username });
  } catch (e) {
    throw { error: [500, "Internal Server Error"] };
  }

  try {
    validation.authUsername({ usernameInput: username });
  } catch (e) {
    throw { error: [500, "Internal Server Error"] };
  }

  username = username.toLowerCase().trim();
  let user;
  const usersCollection = await users();
  try {
    user = await usersCollection.findOne({ username });
  } catch (e) {
    throw { error: [500, "Internal Server Error"] };
  }

  if (!user) {
    throw { error: [500, "Internal Server Error"] };
  }

  return {
    fullName: user.fullName,
    username: user.username,
    DOB: user.DOB,
    enabledModules: user.enabledModules,
  };
};

export const updateEnabledModulesByUsername = async (
  username,
  enabledModules
) => {
  try {
    validation.authParam({ username });
  } catch (e) {
    throw e;
  }

  try {
    validation.authUsername({ usernameInput: username });
  } catch (e) {
    throw e;
  }

  // Edit the user with the new data
  const usersCollection = await users();
  let updateInfo;
  try {
    updateInfo = await usersCollection.updateOne(
      { username },
      { $set: { enabledModules } }
    );
  } catch (e) {
    throw { error: [500, "Internal Server Error"] };
  }

  if (!updateInfo.acknowledged) {
    throw { error: [500, "Internal Server Error"] };
  }
  return { updated: true };
};
