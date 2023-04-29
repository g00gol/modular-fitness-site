import { ObjectId } from "mongodb";
import { calories } from "../config/mongoCollections.js";
import { getByUsername } from "./users.js";
import moment from "moment";
import { invalidNum, invalidStrings, invalidNum } from "../utils/helpers.js";

export const enterCalorie = async (username, datetime, foods) => {
    // enter a meal event into the database
    // input is a timestamp as well as an array of food objects, each containing fields food_name,
    // calories (calories per per serving), servings (number of servings)

    invalidParams(username, datetime, foods, ...foods);

    invalidStrings(username);
    await getByUsername(username); //make sure it exists

    if (!moment(dateTime).isValid()) {
        throw [400, "invalid datetime"];
    }

    if (!foods.length === 0) {
        throw [400, "Error: no foods provided"];
    }

    let foodObjects = [];
    for (const food of foods) {
        if (typeof food !== Object) {
            throw [400, "Error: food entry must be an Object"];
        }
        invalidParams(food.food_name, food.calories, food.calories);
        invalidStrings(food.food_name);
        invalidNum(food.calories, food.servings);
        if (food.calories < 0) {
            throw [400, "Error: invalid calorie count"];
        }
        if (food.servings <= 0) {
            throw [400, "Error: invalid serving count"];
        }
        const newFoodObject = {
            _id: new ObjectId(),
            food_name: food.food_name, // not trimming the food name since it should be from the API
            calories: food.calories,
            quantity: food.servings,
        };
        foodObjects.push(newFoodObject);
    }

    const calorieEntry = {
        username: username.trim(),
        dateTime: datetime,
        foods: foodObjects,
    };

    let calorieCollection = await calories();

    let createInfo = await calorieCollection.insertOne(calorieEntry);
    if (!createInfo.acknowledged || !createInfo.insertedId)
        throw [500, "Error: could not add cardio"];

    calorieEntry._id = createInfo.insertedId.toString();
    return calorieEntry;
};

export const getCaloriesByUsername = async (username) => {
    // gets all the calorie entries for a given username
    // returns as an array of calorie entry objects
    // if user has no calorie entries it will return an empty array, not throw

    invalidParams(username);
    invalidStrings(username);
    await getByUsername(username); //make sure it exists

    let calorieCollection = await calories();

    let calorieEntries = await calorieCollection
        .find({ username: username })
        .toArray();

    if (!calorieEntries || calorieEntries.length == 0) {
        return [];
    }

    entryIDToString = (entry) => {
        entry._id = entry._id.toString();
        let foodIDToString = (food) => {
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
    id = invalidID(id);
    let calorieCollection = await calories();

    let calorieEntries = await calorieCollection
        .find({ _id: new ObjectId(id) })
        .toArray();

    let entry = await calorieEntries.findOne({ _id: new ObjectId(id) });
    if (!entry) {
        throw [400, "entry not found"];
    }

    entry._id = entry._id.toString();
    let foodIDToString = (food) => {
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

    let calorieEntries = await calorieCollection
        .find({ _id: new ObjectId(id) })
        .toArray();

    let entry = await calorieEntries.findOne({ "foods._id": new ObjectId(id) });
    if (!entry) {
        throw [400, "entry not found"];
    }

    foodEntry = entry.foods.find((food) => (food._id = new ObjectId(id)));
    foodEntry._id = foodEntry._id.toString();

    return foodEntry;
};

export const updateCalorie = async (id, foods) => {
    // alows users to update the food objects in their entry
    // no one should ever have to update the username or datetime

    invalidParams(id, foods, ...foods);

    id = invalidID(id);

    entry = await getCalorieByID(id);

    if (!foods.length === 0) {
        throw [400, "Error: no foods provided"];
    }

    let foodObjects = [];
    for (const food of foods) {
        if (typeof food !== Object) {
            throw [400, "Error: food entry must be an Object"];
        }
        invalidParams(food.food_name, food.calories, food.calories);
        invalidStrings(food.food_name);
        invalidNum(food.calories, food.servings);
        if (food.calories < 0) {
            throw [400, "Error: invalid calorie count"];
        }
        if (food.servings <= 0) {
            throw [400, "Error: invalid serving count"];
        }
        const newFoodObject = {
            _id: new ObjectId(),
            food_name: food.food_name, // not trimming the food name since it should be from the API
            calories: food.calories,
            quantity: food.servings,
        };
        foodObjects.push(newFoodObject);
    }

    const calorieEntry = {
        username: entry.username,
        dateTime: entry.datetime,
        foods: foodObjects,
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
