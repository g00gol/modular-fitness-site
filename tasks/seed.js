import bcrypt from "bcrypt";
import moment from "moment";

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users } from "../data/index.js";
import { cardio } from "../data/index.js";
import { timers } from "../data/index.js";

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

const db = await dbConnection();
await db.dropDatabase();

let hashedPassword = await bcrypt.hash("password", 10);
await users.create("John Doe", "johndoe", hashedPassword);

//create some cardio workouts
await cardio.create("johndoe", "run", 1500, 1, moment(), -1, 60);
await cardio.create("johndoe", "walk", 15, 2, moment(), -1, 60);
await cardio.create("johndoe", "run", 15003, 1, moment(), 1502, -1);

//create some timers
let timer1 = await timers.create("johndoe", "plank", "timer", 50);
await timers.create("johndoe", "meditation", "timer", 100);
await timers.create("johndoe", "chill", "timer", 2000);

await users.create("patrick hill", "nycSwag", hashedPassword);
await users.create("mandeep", "mkaur", hashedPassword);
await enterWeight("mkaur", 99);
await enterWeight("mkaur", 1);
await enterWeight("mkaur", 2);
await enterWeight("mkaur", 3);

await enterWeight("johndoe", 1000);
await enterWeight("johndoe", 1000);
let ans22 = await getAllWeightsObj("mkaur");

let ans = await updateWeightEntry(ans22[0]._id.toString(), 700);
// let ans = await getWeightById(ans2[0]._id.toString())
// await deleteOneWeightEnrty("mkaur",ans22[0]._id.toString())
// // console.log("id sent is: "+ ans2[0]._id.toString())
// console.log(ans)

await enterWeight("johndoe", 10);
await enterWeight("johndoe", 100);
await enterWeight("nycSwag", 101);

await enterSugar("johndoe", 11234567, false);

await enterSugar("mkaur", 7, false);
await enterSugar("mkaur", 11234567, false);
await enterSugar("mkaur", 11234567, false);
await enterSugar("mkaur", 11234567, true);
let ans2 = await getAllSugarObj("mkaur");
await updateSugartEntry(ans2[0]._id.toString(), 700, true);

// let ans = await getSugarById(ans2[0]._id.toString())
// console.log("id sent is: "+ ans2[0]._id.toString())
// console.log(ans)
// await deleteOneSugarEnrty("mkaur","6438460abb940a8db0c70896!")
// await deleteAllSugarDataForUser("mkaur")

// await deleteAllWeightDataForUser("mkaur")
console.log("Done seeding the database!");
await closeConnection();
