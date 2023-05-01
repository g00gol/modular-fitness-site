import { ObjectId } from "mongodb";

import { workouts } from "../config/mongoCollections.js";

import * as validation from "../public/js/workoutTrackerValidation.js";
import * as helpers from "../utils/helpers.js";

/**
 * Creates a new workout using the following fields:
 * @param {string} userId - Used to identify the user
 * @param {string} username - Used to identify the user
 * @param {string} workoutName - The name of the workout
 * @param {string} workoutDay - The day of the week the workout is for
 * @returns {string} id of the newly created workout
 * @throws {object} where the key is the type of error and value is error values
 */
const createWorkout = async (userId, username, workoutName, workoutDay) => {
  // Check if userId and username are valid
  try {
    validation.paramExists({ userId, username });
    validation.paramIsString({ userId, username });
  } catch (e) {
    throw { serverError: [500, "Internal Server Error"] };
  }

  // Check if parameters exists
  try {
    validation.paramExists({ workoutName, workoutDay });
  } catch (e) {
    throw { invalid: e };
  }

  let invalidParams = [];

  // Validate workoutName
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

  // Create the workout
  let workout = {
    userId,
    username,
    workoutName,
    workoutDay,
    exercises: [],
  };

  // Add the workout to the database
  const workoutCollection = await workouts();
  const insertInfo = await workoutCollection.insertOne(workout);
  if (insertInfo.insertedCount === 0) {
    throw { serverError: [500, "Internal Server Error"] };
  }
  return insertInfo.insertedId.toString();
};

/**
 * Creates a new exercise using the following fields:
 * @param {string} workoutId - id of the workout
 * @param {string} exerciseName - name of the exercise
 * @param {number} exerciseSets - number of sets per exercise
 * @param {number} exerciseReps - number of reps per set
 * @param {number} exerciseWeight - weight of the exercise
 * @param {string} exerciseWeightUnits - lbs or kg
 * @returns {insertedExercise: true} if the exercise was successfully inserted
 */
const createExercise = async (
  workoutId,
  exerciseName,
  exerciseSets,
  exerciseReps,
  exerciseWeight,
  exerciseWeightUnits
) => {
  // Check if parameters exists
  try {
    validation.paramExists({
      workoutId,
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

  // Validate workoutId
  try {
    workoutId = helpers.invalidID(workoutId);
  } catch (e) {
    invalidParams.push("workoutId");
  }

  // Validate exerciseName and exerciseWeightUnits
  try {
    validation.paramIsString({ exerciseName, exerciseWeightUnits });

    if (exerciseWeightUnits !== "lbs" && exerciseWeightUnits !== "kg") {
      invalidParams.push("exerciseWeightUnits");
    }
  } catch (e) {
    invalidParams = [...invalidParams, ...e];
  }

  // Validate exerciseSets, exerciseReps, and exerciseWeight
  try {
    validation.paramIsNum({ exerciseSets, exerciseReps, exerciseWeight });

    /** Further validation for the specific fields */
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

  // Trim all string parameters
  exerciseName = exerciseName.trim();
  exerciseWeightUnits = exerciseWeightUnits.trim();

  // Create the exercise
  let exercise = {
    _id: new ObjectId(),
    exerciseName,
    exerciseSets,
    exerciseReps,
    exerciseWeight,
    exerciseWeightUnits,
  };

  // Add the exercise to the database
  const workoutCollection = await workouts();
  const updateInfo = await workoutCollection.updateOne(
    { _id: new ObjectId(workoutId) },
    { $push: { exercises: exercise } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw { serverError: [500, "Internal Server Error"] };
  }
  return { insertedExercise: true };
};

/**
 * Gets all workouts for a user
 * @param {string} userId - id of the user
 * @returns {array} workouts - array of workouts
 */
const getWorkouts = async (userId) => {
  // Validate userId
  try {
    validation.paramExists({ userId });
    validation.paramIsString({ userId });
  } catch (e) {
    throw { serverError: [500, "Internal Server Error"] };
  }

  // Get the workouts from the database
  const workoutCollection = await workouts();
  const workouts = await workoutCollection.find({ userId }).toArray();
  if (workouts.length === 0) {
    throw { serverError: [500, "Internal Server Error"] };
  }
  return workouts;
};

export { createWorkout, createExercise, getWorkouts };
