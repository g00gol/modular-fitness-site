import { ObjectId } from "mongodb";
import { cardio } from "../config/mongoCollections.js";
import { getByUsername } from "./users.js";
import { invalidParams, invalidStrings, invalidID } from "../utils/helpers.js";
import moment from "moment";
moment().format();

const create = async (
  username,
  type,
  distance,
  duration,
  dateTime,
  caloriesBurned,
  weight
) => {
  //allow user to input the calories burned if they know, otherwise calculate automatically.
  //use <= 0 to signal that calories burned was not inputted
  //html will grab default weight value from either weight tracker or previous logs

  invalidParams(type, distance, duration, dateTime, caloriesBurned, weight);
  invalidStrings(type);
  if (type != "walk" && type != "run" && type != "cycle" && type != "swim") {
    throw "invalid cardio type";
  }
  //validate dateTime?
  if (!moment(dateTime).isValid()) {
    throw "invalid date";
  }
  ///
  if (typeof duration != "number") {
    throw "Duration must be a number";
  }
  if (duration <= 0) {
    throw "Duration must be greater than 0";
  }
  if (typeof distance != "number") {
    throw "Distance must be a number";
  }
  if (distance <= 0) {
    throw "Distance must be greater than 0";
  }
  if (typeof caloriesBurned != "number") {
    throw "caloriesBurned must be a number";
  }
  if (typeof weight != "number") {
    throw "weight must be a number";
  }
  console.log(caloriesBurned)
  if (caloriesBurned < 0) {
    if (weight <= 0) {
      throw "invalid weight";
    }
    caloriesBurned = calculateCaloriesBurned(weight, distance, duration, type);
  }

  await getByUsername(username); //make sure it exists

  let cardioCollection = await cardio();
  let newCardio = {
    username: username,
    type: type,
    distance: distance,
    duration: duration,
    dateTime: dateTime,
    caloriesBurned: caloriesBurned,
    date: moment(dateTime).format("MM/DD/YYYY")
  };
  let createInfo = await cardioCollection.insertOne(newCardio);
  if (!createInfo.acknowledged || !createInfo.insertedId)
    throw { errorCode: 500, errorMessage: "Error: could not add cardio" };

  newCardio._id = newCardio._id.toString();
  return newCardio;
};

const getAll = async (username) => {
  await getByUsername(username);
  let cardioCollection = await cardio();
  let allCardios = await cardioCollection
    .find({ username: username })
    .toArray();

  for (let i = 0; i < allCardios.length; i++) {
    allCardios[i]._id = allCardios[i]._id.toString();
  }
  return allCardios;
};

const getByID = async (id) => {
  id = invalidID(id);
  let cardioCollection = await cardio();

  let output = await cardioCollection.findOne({ _id: new ObjectId(id) });
  if (!output) {
    throw { errorCode: 400, errorMessage: "Error: cannot find cardio" };
  }

  output._id = output._id.toString();
  return output;
};

const getByDate = async (username, dateTime) => {
  if (!moment(dateTime).isValid()) {
    throw "invalid date";
  }
  await getByUsername(username);

  let cardioCollection = await cardio();
  let allOfDate = await cardioCollection
    .find({ dateTime: dateTime, username: username })
    .toArray();

  if (!allOfDate) {
    throw {
      errorCode: 400,
      errorMessage: "Error: cannot find cardio on this date",
    };
  }

  for (let i = 0; i < allOfDate.length; i++) {
    allOfDate[i]._id = allOfDate[i]._id.toString();
  }

  return allOfDate;
};

const getByType = async (username, type) => {
  invalidStrings(type);
  if (type != "walk" && type != "run" && type != "cycle" && type != "swim") {
    throw "invalid cardio type";
  }

  await getByUsername(username);

  let cardioCollection = await cardio();
  let allOfType = await cardioCollection
    .find({ type: type, username: username })
    .toArray();

  if (!allOfType) {
    throw {
      errorCode: 400,
      errorMessage: "Error: cannot find cardio of this type",
    };
  }

  for (let i = 0; i < allOfType.length; i++) {
    allOfType[i]._id = allOfType[i]._id.toString();
  }

  return allOfType;
};

const remove = async (id) => {
  id = invalidID(id);

  let deleted = getByID(id);

  let cardioCollection = await cardio();
  let deleteInfo = await cardioCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (deleteInfo.lastErrorObject.n === 0) {
    throw {
      errorCode: 500,
      errorMessage: "Error: could not delete Cardio Workout",
    };
  }

  return deleted;
};

const update = async (
  id,
  username,
  type,
  distance,
  duration,
  dateTime,
  caloriesBurned,
  weight
) => {
  invalidParams(type, distance, duration, dateTime, caloriesBurned, weight);
  invalidStrings(type);
  invalidID(id);
  if (type != "walk" && type != "run" && type != "cycle" && type != "swim") {
    throw "invalid cardio type";
  }
  //validate dateTime?
  if (!moment(dateTime).isValid()) {
    throw "invalid date";
  }
  ///
  if (typeof duration != "number") {
    throw "Duration must be a number";
  }
  if (duration <= 0) {
    throw "Duration must be greater than 0";
  }
  if (typeof distance != "number") {
    throw "Distance must be a number";
  }
  if (distance <= 0) {
    throw "Distance must be greater than 0";
  }
  if (typeof caloriesBurned != "number") {
    throw "caloriesBurned must be a number";
  }
  if (typeof weight != "number") {
    throw "weight must be a number";
  }
  if (caloriesBurned <= 0) {
    if (weight <= 0) {
      throw "invalid weight";
    }
    caloriesBurned = calculateCaloriesBurned(weight, distance, duration, type);
  }

  await getByUsername(username); //make sure it exists

  let cardioCollection = await cardio();
  let updatedCardio = {
    _id: new ObjectId(id),
    username: username,
    type: type,
    distance: distance,
    duration: duration,
    dateTime: dateTime,
    caloriesBurned: caloriesBurned,
    date: moment(dateTime).format("MM/DD/YYYY")
  };
  let updateInfo = await cardioCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedCardio },
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

//calculate calories burned
/**
 * weight (kgs)
 * distance (miles)
 * time (hours)
 *
 */
let calculateCaloriesBurned = (weight, distance, time, type) => {
  let mets = {
    walk: (speed) => {
      return speed * 1.7;
    },
    run: (speed) => {
      return speed * 1.7;
    },
    cycle: (speed) => {
      return speed * speed * 0.04;
    },
    swim: (speed) => {
      return 7;
    },
  };

  return (mets[type](distance / time) * weight * time).toFixed(0);
};

export { create, getByID, getByDate, getAll, getByType, remove, update };
