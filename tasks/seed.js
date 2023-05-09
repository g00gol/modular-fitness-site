import moment from "moment";

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users } from "../data/index.js";
import { cardio } from "../data/index.js";
import { timers } from "../data/index.js";
import { workouts } from "../data/index.js";
import { calories } from "../data/index.js";
import { notes } from "../data/index.js";

import {
  enterWeight,
  deleteAllWeightDataForUser,
  getAllWeightsObj,
  getWeightById,
  deleteOneWeightEnrty,
  updateWeightEntry,
} from "../data/weight.js";
import {
  enterSugar,
  deleteAllSugarDataForUser,
  deleteOneSugarEnrty,
  getAllSugarObj,
  getSugarById,
  updateSugartEntry,
} from "../data/sugar.js";
import { getFoodByID } from "../data/calories.js";

const db = await dbConnection();
await db.dropDatabase();

let testPassword = "!Test123456";
await users.createUser(
  "John Doe",
  "johndoe",
  testPassword,
  testPassword,
  "2001-01-01"
);
let userJohn = await users.checkUser("johndoe", testPassword);

await users.createUser(
  "Mandeep Kaur",
  "mkaur",
  testPassword,
  testPassword,
  "2001-01-01"
);
let userMandeep = await users.checkUser("mkaur", testPassword);

await users.createUser(
  "Patrick Hill",
  "nycSwag",
  testPassword,
  testPassword,
  "2001-01-01"
);
let userPat = await users.checkUser("nycswag", testPassword);

//create some cardio workouts
await cardio.create("johndoe", "run", 1500, 1, moment(), -1, 60);
await cardio.create("johndoe", "walk", 15, 2, moment(), -1, 60);
await cardio.create("johndoe", "run", 1003, 1, moment(), 1502, -1);

//create some timers
let timer1 = await timers.create("johndoe", "plank", "timer", 50);
await timers.create("johndoe", "meditation", "timer", 100);
await timers.create("johndoe", "chill", "timer", 2000);

await enterWeight("mkaur", 160);
await enterWeight("mkaur", 163);
await enterWeight("mkaur", 162);
await enterWeight("mkaur", 159);

await enterWeight("johndoe", 120);
await enterWeight("johndoe", 122);
let ans22 = await getAllWeightsObj("mkaur");

await enterWeight("johndoe", 101);
await enterWeight("johndoe", 99);

await enterWeight("nycSwag", 142);
await enterWeight("nycSwag", 140);

await enterSugar("johndoe", 191, false);
await enterSugar("johndoe", 201, false);
await enterSugar("johndoe", 182, true);


await enterSugar("mkaur", 109, true);
await enterSugar("mkaur", 192, false);
await enterSugar("mkaur", 113, true);
await enterSugar("mkaur", 154, false);

let ans2 = await getAllSugarObj("mkaur");


let workout1 = await workouts.createWorkout(
  userPat.uid,
  userPat.username,
  "workout1",
  "Sunday"
);
await workouts.createExercise(workout1.toString(), "pushups", 3, 10, 60, "kg");
await workouts.createExercise(
  workout1.toString(),
  "bench press",
  3,
  10,
  70,
  "kg"
);
await workouts.createExercise(
  workout1.toString(),
  "pike pushups ",
  3,
  10,
  60,
  "lbs"
);

let workout2 = await workouts.createWorkout(
  userPat.uid,
  userPat.username,
  "workout2",
  "Monday"
);
await workouts.createExercise(workout2.toString(), "squats", 3, 10, 60, "kg");
await workouts.createExercise(workout2.toString(), "lunges", 3, 10, 70, "kg");

let workout3 = await workouts.createWorkout(
  userJohn.uid,
  userJohn.username,
  "workout1",
  "Sunday"
);
await workouts.createExercise(workout3.toString(), "pushups", 3, 10, 60, "kg");
await workouts.createExercise(
  workout3.toString(),
  "bench press",
  3,
  10,
  70,
  "kg"
);
await workouts.createExercise(
  workout3.toString(),
  "pike pushups ",
  3,
  10,
  60,
  "lbs"
);

await calories.enterCalorie(userJohn.uid, "johndoe", moment().toISOString(), [
  { food_name: "banana", calories: 100, quantity: 2 },
  { food_name: "apple", calories: 100, quantity: 2 },
  { food_name: "watermelon", calories: 100, quantity: 2 },
]);
await calories.enterCalorie(userJohn.uid, "johndoe", moment().toISOString(), [
  { food_name: "water", calories: 0, quantity: 1 },
  { food_name: "chips", calories: 100, quantity: 2 },
  { food_name: "soda", calories: 100, quantity: 1 },
]);
await calories.enterCalorie(userMandeep.uid, "mkaur", moment().toISOString(), [
  { food_name: "banana", calories: 100, quantity: 2 },
  { food_name: "apple", calories: 100, quantity: 2 },
  { food_name: "watermelon", calories: 100, quantity: 2 },
]);
await calories.enterCalorie(userMandeep.uid, "mkaur", moment().toISOString(), [
  { food_name: "water", calories: 0, quantity: 1 },
  { food_name: "chips", calories: 100, quantity: 2 },
  { food_name: "soda", calories: 100, quantity: 1 },
]);
await calories.enterCalorie(
  userPat.uid,
  "nycSwag",
  moment().subtract(1, "days").toISOString(),
  [
    { food_name: "water", calories: 0, quantity: 1 },
    { food_name: "chips", calories: 100, quantity: 2 },
    { food_name: "soda", calories: 100, quantity: 1 },
  ]
);
await calories.enterCalorie(userPat.uid, "nycSwag", moment().toISOString(), [
  { food_name: "banana", calories: 100, quantity: 2 },
  { food_name: "apple", calories: 100, quantity: 2 },
  { food_name: "watermelon", calories: 100, quantity: 2 },
]);

await notes.enterNote(
  userJohn.uid,
  "johndoe",
  moment().toISOString(),
  "",
  "\t"
);
await notes.enterNote(
  userJohn.uid,
  "johndoe",
  moment().toISOString(),
  "log",
  "i feel pretty fit today ngl"
);
await notes.enterNote(
  userMandeep.uid,
  "mkaur",
  moment().toISOString(),
  "water",
  "\tdidn't drink enough of it today :("
);
await notes.enterNote(
  userMandeep.uid,
  "mkaur",
  moment().toISOString(),
  "food",
  "\tdidn't eat enough of it today :((("
);
await notes.enterNote(
  userPat.uid,
  "nycSwag",
  moment().toISOString(),
  "",
  "damn, the sky is mad beautiful today"
);
await notes.enterNote(
  userPat.uid,
  "nycSwag",
  moment().toISOString(),
  "",
  "who needs titles lol"
);

console.log("Done seeding the database!");
await closeConnection();
