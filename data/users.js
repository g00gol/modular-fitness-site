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
  invalidParams();

  // Check if given parameters are valid strings (verbose)
  invalidStrings();

  // Check if given parameters are valid string arrays (verbose)
  invalidStrArrays();

  // Trim all strings

  // Insert band into database
  let bandsCollection = await users();
  let createInfo = await bandsCollection.insertOne();
  if (!createInfo.acknowledged || !createInfo.insertedId)
    throw [500, "Error: could not add users"];

  let user = await get(createInfo.insertedId.toString());
  return user;
};

export { create };
