import { ObjectId } from "mongodb";
import { calories } from "../config/mongoCollections.js";
import { getByUsername } from "./users.js";
import moment from "moment";
import {
  invalidParams,
  invalidStrings,
  invalidNum,
  invalidID,
} from "../utils/helpers.js";

export const enterCalorie = async (userID, username, dateTime, foods) => {
  // enter a meal event into the database
  // input is a username, a timestamp, as well as an array of food objects, each containing fields food_name,
  // calories (calories per per serving), quantity (number of servings)

  invalidParams(userID, username, dateTime, foods, ...foods);
  userID = invalidID(userID);

  invalidStrings(username, dateTime);
  username = username.toLowerCase();
  await getByUsername(username); //make sure it exists

  if (!moment(dateTime).isValid()) {
    throw [400, "invalid datetime"];
  }

  if (foods.length === 0) {
    throw [400, "Error: no foods provided"];
  }

  let totalCals = 0;
  let foodObjects = [];
  for (const food of foods) {
    if (typeof food !== "object") {
      throw [400, "Error: food entry must be an Object"];
    }
    invalidParams(food.food_name, food.calories, food.quantity);
    invalidStrings(food.food_name);
    food.food_name = food.food_name.trim();
    if (food.food_name.length <= 0 || food.food_name.length > 1000) {
      throw [400, "Error: invalid food name"];
    }
    invalidNum(food.calories, food.quantity);
    if (food.calories < 0 || food.calories > 30000) {
      throw [400, "Error: invalid calorie count"];
    }
    if (food.quantity <= 0 || food.quantity > 1000) {
      throw [400, "Error: invalid serving count"];
    }
    totalCals = totalCals + food.calories * food.quantity;
    const newFoodObject = {
      _id: new ObjectId(),
      food_name: food.food_name, // not trimming the food name since it should be from the API
      calories: food.calories,
      quantity: food.quantity,
    };
    foodObjects.push(newFoodObject);
  }

  const calorieEntry = {
    userID: userID,
    username: username.trim(),
    dateTime: dateTime,
    date: moment(dateTime).format("MM/DD/YYYY h:mm a"),
    foods: foodObjects,
    totalCalories: totalCals,
  };

  let calorieCollection = await calories();

  let createInfo = await calorieCollection.insertOne(calorieEntry);
  if (!createInfo.acknowledged || !createInfo.insertedId)
    throw [500, "Error: could not add calorie entry"];

  calorieEntry._id = createInfo.insertedId.toString();
  return calorieEntry;
};

export const getCaloriesByUserID = async (userID) => {
  // gets all the calorie entries for a given username
  // returns as an array of calorie entry objects
  // if user has no calorie entries it will return an empty array, not throw

  invalidParams(userID);
  userID = invalidID(userID);

  let calorieCollection = await calories();

  let calorieEntries = await calorieCollection
    .find({ userID: userID })
    .toArray();

  if (!calorieEntries || calorieEntries.length == 0) {
    return [];
  }

  const entryIDToString = (entry) => {
    entry._id = entry._id.toString();
    const foodIDToString = (food) => {
      food._id = food._id.toString();
      return food;
    };
    entry.foods = entry.foods.map(foodIDToString);
    return entry;
  };
  calorieEntries = calorieEntries.map(entryIDToString);

  return calorieEntries;
};

export const getCalorieByID = async (id) => {
  invalidParams(id);
  id = invalidID(id);
  let calorieCollection = await calories();

  let entry = await calorieCollection.findOne({ _id: new ObjectId(id) });
  if (!entry) {
    throw [400, "entry not found"];
  }

  entry._id = entry._id.toString();
  const foodIDToString = (food) => {
    food._id = food._id.toString();
    return food;
  };
  entry.foods = entry.foods.map(foodIDToString);

  return entry;
};

export const getFoodByID = async (id) => {
  /// idk if we will ever have to use this function

  id = invalidID(id);
  let calorieCollection = await calories();

  let entry = await calorieCollection.findOne({
    "foods._id": new ObjectId(id),
  });
  if (!entry) {
    throw [400, "entry not found"];
  }

  let foodEntry = entry.foods.find((food) => (food._id = new ObjectId(id)));
  foodEntry._id = foodEntry._id.toString();

  return foodEntry;
};

export const updateCalorie = async (id, foods) => {
  // alows users to update the food objects in their entry
  // no one should ever have to update the username or datetime

  invalidParams(id, foods, ...foods);
  id = invalidID(id);

  let entry = await getCalorieByID(id);

  if (!foods.length === 0) {
    throw [400, "Error: no foods provided"];
  }

  let totalCals = 0;
  let foodObjects = [];
  for (const food of foods) {
    if (typeof food !== "object") {
      throw [400, "Error: food entry must be an Object"];
    }
    invalidParams(food.food_name, food.calories, food.quantity);
    invalidStrings(food.food_name);
    food.food_name = food.food_name.trim();
    if (food.food_name.length <= 0 || food.food_name.length > 1000) {
      throw [400, "Error: invalid food name"];
    }
    invalidNum(food.calories, food.quantity);
    if (food.calories < 0 || food.calories > 30000) {
      throw [400, "Error: invalid calorie count"];
    }
    if (food.quantity <= 0 || food.quantity > 1000) {
      throw [400, "Error: invalid serving count"];
    }
    totalCals = totalCals + food.calories * food.quantity;
    const newFoodObject = {
      _id: new ObjectId(),
      food_name: food.food_name, // not trimming the food name since it should be from the API
      calories: food.calories,
      quantity: food.quantity,
    };
    foodObjects.push(newFoodObject);
  }

  const calorieEntry = {
    userID: entry.userID,
    username: entry.username,
    dateTime: entry.dateTime,
    date: entry.date,
    foods: foodObjects,
    totalCalories: totalCals,
  };

  let calorieCollection = await calories();

  let updatedInfo = await calorieCollection.findOneAndReplace(
    { _id: new ObjectId(id) },
    calorieEntry,
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw Error("could not update calorie entry successfully");
  }

  updatedInfo.value._id = updatedInfo.value._id.toString();
  let foodIDToString = (food) => {
    food._id = food._id.toString();
    return food;
  };
  updatedInfo.value.foods = updatedInfo.value.foods.map(foodIDToString);

  return updatedInfo.value;
};

export const deleteCalorie = async (id) => {
  invalidParams(id);
  id = invalidID(id);

  let calorieCollection = await calories();

  const deletionInfo = await calorieCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (deletionInfo.lastErrorObject.n === 0) {
    throw Error(`Could not delete calorie entry with id of ${id}`);
  }

  return `calorie entry has been successfully deleted!`;
};
