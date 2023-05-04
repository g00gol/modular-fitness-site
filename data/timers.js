import { ObjectId } from "mongodb";
import { timers } from "../config/mongoCollections.js";
import { getByUsername } from "./users.js";
import {
  invalidParams,
  invalidStrings,
  invalidID,
  formatDuration,
} from "../utils/helpers.js";

const create = async (username, title, type, duration) => {
  invalidParams(title, type, duration);
  invalidStrings(title, type);
  type = type.trim();
  title = title.trim();
  if (!(type == "timer" || type == "stopwatch")) {
    throw "invalid type";
  }
  if (typeof duration != "number") {
    throw "Duration must be a number";
  }
  if (duration <= 0) {
    throw "Duration must be greater than 0";
  }

  await getByUsername(username); //make sure it exists

  let timerCollection = await timers();
  let newTimer = {
    username: username,
    title: title,
    type: type,
    duration: duration,
    durationFormat: formatDuration(duration),
  };
  let createInfo = await timerCollection.insertOne(newTimer);
  if (!createInfo.acknowledged || !createInfo.insertedId)
    throw { errorCode: 500, errorMessage: "Error: could not add timer" };

  newTimer._id = newTimer._id.toString();
  return newTimer;
};

const getAll = async (username) => {
  await getByUsername(username);
  let timerCollection = await timers();
  let allTimers = await timerCollection.find({ username: username }).toArray();

  if (!allTimers || allTimers.length == 0) {
    //throw { errorCode: 400, errorMessage: "Error: user has no timers" };
    return [];
  }

  for (let i = 0; i < allTimers.length; i++) {
    allTimers[i]._id = allTimers[i]._id.toString();
  }
  return allTimers;
};

const get = async (id) => {
  id = invalidID(id);
  let timerCollection = await timers();

  let output = await timerCollection.findOne({ _id: new ObjectId(id) });
  if (!output) {
    throw { errorCode: 400, errorMessage: "Error: cannot find cardio" };
  }

  output._id = output._id.toString();
  return output;
};

const remove = async (id) => {
  id = invalidID(id);

  let deleted = get(id);

  let timerCollection = await timers();
  let deleteInfo = await timerCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (deleteInfo.lastErrorObject.n === 0) {
    throw { errorCode: 500, errorMessage: "Error: could not delete timer" };
  }

  return deleted;
};

const update = async (id, username, title, type, duration) => {
  invalidParams(title, type, duration);
  invalidStrings(title, type);
  type = type.trim();
  title = title.trim();
  if (!(type == "timer" || type == "stopwatch")) {
    throw "invalid type";
  }
  if (typeof duration != "number") {
    throw "Duration must be a number";
  }
  if (duration <= 0) {
    throw "Duration must be greater than 0";
  }
  invalidID(id);

  await getByUsername(username); //make sure it exists

  let timerCollection = await timers();
  let updatedTimer = {
    _id: new ObjectId(id),
    username: username,
    title: title,
    type: type,
    duration: duration,
    durationFormat: formatDuration(duration),
  };
  let updateInfo = await timerCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedTimer },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0) {
    throw {
      errorCode: 500,
      errorMessage: "Error: could not update Cardio Workout",
    };
  }

  updateInfo.value._id = updateInfo.value._id.toString();
  return updateInfo.value;
};

export { create, get, getAll, remove, update };
