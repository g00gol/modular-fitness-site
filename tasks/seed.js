import bcrypt from "bcrypt";
import moment from "moment";

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users } from "../data/index.js";
import { cardio } from "../data/index.js";
import { timers } from "../data/index.js";


const db = await dbConnection();
await db.dropDatabase();

let hashedPassword = await bcrypt.hash("password", 10);
await users.create("John Doe", "johndoe", hashedPassword);

//create some cardio workouts
await cardio.create("johndoe", "run", 1500, 1, moment(), -1, 60)
await cardio.create("johndoe", "walk", 15, 2, moment(), -1, 60)
await cardio.create("johndoe", "run", 15003, 1, moment(), 1502, -1)

//create some timers
let timer1 = await timers.create("johndoe", "plank", "timer", 50)
await timers.create("johndoe", "meditation", "timer", 100)
await timers.create("johndoe", "chill", "timer", 2000)

console.log(await timers.update(timer1._id, "johndoe", "plankies", "timer", 100))

console.log("Done seeding the database!");
await closeConnection();
