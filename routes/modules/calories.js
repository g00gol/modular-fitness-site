import { Router } from "express";
import xss from "xss";

import * as calorieDataFuncs from "../../data/calories.js";
import * as validation from "../../public/js/moduleValidation.js";
import * as helpers from "../../utils/helpers.js";
import moment from "moment";

const router = Router();

const checkFoods = (foods) => {
  helpers.invalidParams(foods, ...foods);

  if (foods.length === 0) {
    throw [400, "Error: no foods provided"];
  }

  for (const food of foods) {
    if (typeof food !== "object") {
      throw [400, "Error: food entry must be an Object"];
    }
    helpers.invalidParams(food.food_name, food.calories, food.quantity);
    helpers.invalidStrings(food.food_name);
    food.food_name = food.food_name.trim();
    if (food.food_name.length <= 0 || food.food_name.length > 1000) {
      throw [400, "Error: invalid food name"];
    }
    helpers.invalidNum(food.calories, food.quantity);
    if (food.calories < 0 || food.calories > 30000) {
      throw [400, "Error: invalid calorie count"];
    }
    if (food.quantity <= 0 || food.quantity > 1000) {
      throw [400, "Error: invalid serving count"];
    }
  }
};

router.route("/").post(async (req, res) => {
  let { uid, username } = req.session.user;
  // Check if userId and username are valid
  try {
    validation.paramExists({ uid, username });
    validation.paramIsString({ uid, username });
  } catch (e) {
    if (e.invalid) {
      return res.redirect("/error?status=400");
    } else {
      return res.redirect("/error?status=500");
    }
  }

  let { foodName, calories, servings } = req.body;
  // XSS to sanitize the inputs
  function sanitizeInput(input) {
    if (!Array.isArray(input)) {
      return xss(input);
    }
    return input.map((item) => xss(item));
  }

  foodName = sanitizeInput(foodName);
  calories = sanitizeInput(calories);
  servings = sanitizeInput(servings);

  // Check if all the fields have the same number of elements
  // Convert all the fields to arrays if they are not already
  let foodFields = [foodName, calories, servings];
  const arrayFields = foodFields.map((field) =>
    Array.isArray(field) ? field : [field]
  );

  [foodName, calories, servings] = arrayFields;

  // Check if all fields have the same length
  const sameLength = arrayFields.every(
    (field) => field.length === foodName.length
  );

  if (!sameLength) {
    return res.redirect("/modules?invalid=true");
  }

  let foods = [];
  for (let i = 0; i < foodName.length; i++) {
    foods.push({
      food_name: foodName[i],
      calories: Number(calories[i]),
      quantity: Number(servings[i]),
    });
  }

  // validate the foods
  try {
    checkFoods(foods);
  } catch (e) {
    return res.redirect("/modules?invalid=true");
  }

  // Create the calorie
  try {
    await calorieDataFuncs.enterCalorie(
      uid,
      username,
      moment().toISOString(),
      foods
    );
  } catch (e) {
    return res.redirect(`/error?status=${e[0]}`);
  }

  return res.redirect("/modules");
});

router.route("/:calorieID").get(async (req, res) => {
  let isClientSideRequest = req.header("X-Client-Side-Request") === "true";
  if (!isClientSideRequest) {
    return res.redirect("/error?status=403");
  }

  let uid = req.session.user.uid;

  try {
    helpers.invalidParams(uid);
    uid = helpers.invalidID(uid);
  } catch (e) {
    return res.json({ error: e[1] });
  }

  let { calorieID } = req.params;

  try {
    helpers.invalidParams(calorieID);
    calorieID = helpers.invalidID(calorieID);
  } catch (e) {
    return res.json({ error: e[1] });
  }

  // Check if the calorie exists
  let calorieEntry;
  try {
    calorieEntry = await calorieDataFuncs.getCalorieByID(calorieID);
  } catch (e) {
    return res.json({ error: e[1] });
  }

  // IMPORTANT: make sure the current user is the owner of the calorie
  if (calorieEntry.userID !== uid) {
    return res.json({ error: "User mismatch!" });
  }

  return res.json(calorieEntry);
});

router.route("/:calorieId").post(async (req, res) => {
  let { uid, username } = req.session.user;
  // Check if userId and username are valid
  try {
    validation.paramExists({ uid, username });
    validation.paramIsString({ uid, username });
  } catch (e) {
    if (e.invalid) {
      return res.redirect("/error?status=400");
    } else {
      return res.redirect("/error?status=500");
    }
  }

  let { calorieId } = req.params;
  // Check if calorieId is valid
  try {
    validation.paramExists({ calorieId });
    validation.paramIsString({ calorieId });
  } catch (e) {
    if (e.invalid) {
      return res.redirect("/error?status=400");
    } else {
      return res.redirect("/error?status=500");
    }
  }

  // Check if calorieId is a valid ObjectId
  try {
    helpers.invalidID(calorieId);
  } catch (e) {
    return res.redirect("/error?status=400");
  }

  // Check if the calorie exists
  let calorieEntry;
  try {
    calorieEntry = await calorieDataFuncs.getCalorieByID(calorieId);
  } catch (e) {
    return res.redirect("/error?status=500");
  }

  // IMPORTANT: make sure the current user is the owner of the calorie
  if (calorieEntry.userID !== uid) {
    return res.redirect("/error?status=403");
  }

  let { foodName, calories, servings } = req.body;
  // XSS to sanitize the inputs
  function sanitizeInput(input) {
    if (!Array.isArray(input)) {
      return xss(input);
    }
    return input.map((item) => xss(item));
  }

  foodName = sanitizeInput(foodName);
  calories = sanitizeInput(calories);
  servings = sanitizeInput(servings);

  // Check if all the fields have the same number of elements
  // Convert all the fields to arrays if they are not already
  let foodFields = [foodName, calories, servings];
  const arrayFields = foodFields.map((field) =>
    Array.isArray(field) ? field : [field]
  );

  [foodName, calories, servings] = arrayFields;

  // Check if all fields have the same length
  const sameLength = arrayFields.every(
    (field) => field.length === foodName.length
  );

  if (!sameLength) {
    return res.redirect("/modules?invalid=true");
  }

  let foods = [];
  for (let i = 0; i < foodName.length; i++) {
    foods.push({
      food_name: foodName[i],
      calories: Number(calories[i]),
      quantity: Number(servings[i]),
    });
  }

  // validate the foods
  try {
    checkFoods(foods);
  } catch (e) {
    return res.redirect("/modules?invalid=true");
  }

  // Update the calorie
  try {
    await calorieDataFuncs.updateCalorie(calorieId, foods);
  } catch (e) {
    return res.redirect(`/error?status=${e[0]}`);
  }

  return res.redirect("/modules");
});

export default router;
