import { ObjectId } from "mongodb";

import { users } from "../config/mongoCollections.js";
import {
  invalidParams,
  invalidStrings,
  invalidStrArrays,
  invalidID,
  arraysEqual,
} from "../utils/helpers.js";

const create = async (name, username, password) => {
  // Check if all parameters exist
  invalidParams(name, username, password);

  // Check if given parameters are valid strings (verbose)
  invalidStrings(name, username, password);

  // Trim all strings
  name = name.trim();
  username = username.trim();
  password = password.trim();

  // Insert user into database
  let newUser = {
    name,
    username,
    password,
  };

  let usersCollection = await users();
  let createInfo = await usersCollection.insertOne(newUser);
  if (!createInfo.acknowledged || !createInfo.insertedId)
    throw { errorCode: 500, errorMessage: "Error: could not add users" };

  return createInfo;
};

const getByUsername = async (username) => {
  // Check if all parameters exist
  invalidParams(username);

  // Check if given parameters are valid strings (verbose)
  invalidStrings(username);

  // Trim all strings
  username = username.trim();

  // Find user in database
  let usersCollection = await users();
  let user = await usersCollection.findOne({
    username: username,
  });

  // Check if user exists
  if (!user)
    throw {
      errorCode: 404,
      errorMessage: `Error: user not found with username ${username}`,
    };

  user._id = user._id.toString();
  return user;
};

export { create, getByUsername };
