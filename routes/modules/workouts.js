import { Router } from "express";
import xss from "xss";

import * as workouts from "../../data/workouts.js";
import * as validation from "../../public/js/workoutTrackerValidation.js";

const router = Router();

/**
 * Validates the workout parameters
 * @param {string} userId - Used to identify the user
 * @param {string} username - Used to identify the user
 * @param {string} workoutName - The name of the workout
 * @param {string} workoutDay - The day of the week the workout is for
 * @throws {object} where the key is the type of error and value is error values
 */
function validateWorkout(workoutName, workoutDay) {
  // Check if parameters exists
  try {
    validation.paramExists({ workoutName, workoutDay });
  } catch (e) {
    throw { invalid: e };
  }

  let invalidParams = [];
  // Validate userId, username, workoutName
  try {
    validation.paramIsString({ workoutName });
  } catch (e) {
    invalidParams = [...invalidParams, ...e];
  }

  // Validate workoutDay
  if (
    workoutDay !== "Sunday" &&
    workoutDay !== "Monday" &&
    workoutDay !== "Tuesday" &&
    workoutDay !== "Wednesday" &&
    workoutDay !== "Thursday" &&
    workoutDay !== "Friday" &&
    workoutDay !== "Saturday"
  ) {
    invalidParams.push("workoutDay");
  }

  // If there are invalid params, add invalidInput class to the input fields that are invalid
  if (invalidParams.length > 0) {
    throw { invalid: invalidParams };
  }
}

/**
 * Validates the exercise parameters
 * @param {*} exerciseName
 * @param {*} exerciseSets
 * @param {*} exerciseReps
 * @param {*} exerciseWeight
 * @param {*} exerciseWeightUnits
 * @throw {object} where the key is the type of error and value is error values
 */
function validateExercise(
  exerciseName,
  exerciseSets,
  exerciseReps,
  exerciseWeight,
  exerciseWeightUnits
) {
  // Check if parameters exists
  try {
    validation.paramExists({
      exerciseName,
      exerciseSets,
      exerciseReps,
      exerciseWeight,
      exerciseWeightUnits,
    });
  } catch (e) {
    throw { invalid: e };
  }

  let invalidParams = [];
  // Validate exerciseName and exerciseWeightUnits
  try {
    validation.paramIsString({ exerciseName, exerciseWeightUnits });
  } catch (e) {
    invalidParams = [...invalidParams, ...e];
  }

  // Validate exerciseSets, exerciseReps, exerciseWeight
  try {
    validation.paramIsNum({ exerciseSets, exerciseReps, exerciseWeight });

    // Further validation for the specific fields
    exerciseSets = Number(exerciseSets);
    exerciseReps = Number(exerciseReps);
    exerciseWeight = Number(exerciseWeight);
    let invalidParams = [];

    // Check if exercise sets is a positive integer between 1 and 99
    if (
      !Number.isInteger(exerciseSets) ||
      exerciseSets < 1 ||
      exerciseSets > 99
    ) {
      invalidParams.push("exerciseSets");
    }

    // Check if exercise reps is a positive integer between 1 and 99
    if (
      !Number.isInteger(exerciseReps) ||
      exerciseReps < 1 ||
      exerciseReps > 99
    ) {
      invalidParams.push("exerciseReps");
    }

    // Check if exercise weight is a positive number between 0 and 9999
    if (isNaN(exerciseWeight) || exerciseWeight <= 0 || exerciseWeight > 9999) {
      invalidParams.push("exerciseWeight");
    }

    if (invalidParams.length > 0) throw invalidParams;
  } catch (e) {
    invalidParams = [...invalidParams, ...e];
  }

  if (invalidParams.length > 0) {
    throw { invalid: invalidParams };
  }
}

router.route("/").post(async (req, res) => {
  //console.log(req.body);
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

  let { workoutName, workoutDay } = req.body;
  workoutName = xss(workoutName);
  workoutDay = xss(workoutDay);
  // Check if workoutName and workoutDay are valid
  try {
    validateWorkout(workoutName, workoutDay);
  } catch (e) {
    if (e.invalid) {
      return res.redirect("/modules?invalid=true");
    } else {
      return res.redirect("/error?status=500");
    }
  }

  let {
    exerciseName,
    exerciseSets,
    exerciseReps,
    exerciseWeight,
    exerciseWeightUnits,
  } = req.body;
  // XSS to sanitize the inputs
  function sanitizeInput(input) {
    if (!Array.isArray(input)) {
      return xss(input);
    }
    return input.map((item) => xss(item));
  }

  exerciseName = sanitizeInput(exerciseName);
  exerciseSets = sanitizeInput(exerciseSets);
  exerciseReps = sanitizeInput(exerciseReps);
  exerciseWeight = sanitizeInput(exerciseWeight);
  exerciseWeightUnits = sanitizeInput(exerciseWeightUnits);

  // Check if all the fields have the same number of elements
  // Convert all the fields to arrays if they are not already
  let exerciseFields = [
    exerciseName,
    exerciseSets,
    exerciseReps,
    exerciseWeight,
    exerciseWeightUnits,
  ];
  const arrayFields = exerciseFields.map((field) =>
    Array.isArray(field) ? field : [field]
  );

  [
    exerciseName,
    exerciseSets,
    exerciseReps,
    exerciseWeight,
    exerciseWeightUnits,
  ] = arrayFields;

  // Check if all fields have the same length
  const sameLength = arrayFields.every(
    (field) => field.length === exerciseName.length
  );

  if (!sameLength) {
    return res.redirect("/modules?invalid=true");
  }

  // For each exercise, validate the parameters
  let exercises = [];
  for (let i = 0; i < exerciseName.length; i++) {
    try {
      validateExercise(
        exerciseName[i],
        exerciseSets[i],
        exerciseReps[i],
        exerciseWeight[i],
        exerciseWeightUnits[i]
      );
    } catch (e) {
      return res.redirect("/modules?invalid=true");
    }

    exercises.push({
      exerciseName: exerciseName[i],
      exerciseSets: exerciseSets[i],
      exerciseReps: exerciseReps[i],
      exerciseWeight: exerciseWeight[i],
      exerciseWeightUnits: exerciseWeightUnits[i],
    });
  }

  // Create the workout
  try {
    let workoutId = await workouts.createWorkout(
      uid,
      username,
      workoutName,
      workoutDay
    );
    for (let i = 0; i < exercises.length; i++) {
      await workouts.createExercise(
        workoutId,
        exercises[i].exerciseName,
        exercises[i].exerciseSets,
        exercises[i].exerciseReps,
        exercises[i].exerciseWeight,
        exercises[i].exerciseWeightUnits
      );
    }
  } catch (e) {
    return res.redirect("/modules?invalid=true");
  }

  return res.redirect("/modules");
});

export default router;
