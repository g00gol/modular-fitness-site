import bcrypt from "bcrypt";

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users } from "../data/index.js";
import {enterWeight , deleteAllWeightDataForUser, getAllWeightsObj, getWeightById } from "../data/weight.js";
import {enterSugar , deleteAllSugarDataForUser, deleteOneSugarEnrty, getAllSugarObj, getSugarById } from "../data/sugar.js";

const db = await dbConnection();
await db.dropDatabase();

let hashedPassword = await bcrypt.hash("password", 10);
await users.create("John Doe", "johndoe", hashedPassword);
// await users.create("patrick hill", "nycSwag", hashedPassword);
await users.create("mandeep", "mkaur", hashedPassword);
await enterWeight("mkaur", 99)
await enterWeight("mkaur", 1000)
await enterWeight("mkaur", 1000)
await enterWeight("mkaur", 1000)
await enterWeight("johndoe", 1000)
await enterWeight("johndoe", 1000)
// let ans2 = await getAllWeightsObj("mkaur")
// let ans = await getWeightById(ans2[0]._id.toString())
// // console.log("id sent is: "+ ans2[0]._id.toString())
// console.log(ans)

// await enterWeight("johndoe", 10)
// await enterWeight("johndoe", 100)
// await enterWeight("nycSwag", 101)
await enterSugar ("johndoe", 11234567, false)
await enterSugar ("mkaur", 7, false)
await enterSugar ("mkaur", 11234567, false)
await enterSugar ("mkaur", 11234567, false)
await enterSugar ("mkaur", 11234567, true)
let ans2 = await getAllSugarObj("mkaur")
let ans = await deleteOneSugarEnrty("mkaur", ans2[0]._id.toString())
console.log(ans)

// let ans = await getSugarById(ans2[0]._id.toString())
// console.log("id sent is: "+ ans2[0]._id.toString())
// console.log(ans)
// await deleteOneSugarEnrty("mkaur","6438460abb940a8db0c70896!")
// await deleteAllSugarDataForUser("mkaur")

// await deleteAllWeightDataForUser("mkaur")
console.log("Done seeding the database!");
await closeConnection();