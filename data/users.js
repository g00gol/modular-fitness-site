import { ObjectId } from "mongodb";

import { users } from "../config/mongoCollections.js";
import {
  invalidParams,
  invalidStrings,
  invalidStrArrays,
  invalidID,
  arraysEqual,
} from "../helpers.js";

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
    throw [500, "Error: could not add users"];

  return createInfo;
};

export { create };
