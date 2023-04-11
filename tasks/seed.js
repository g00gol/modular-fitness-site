import bcrypt from "bcrypt";

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users } from "../data/index.js";
import {enterWeight } from "../data/weight.js";

const db = await dbConnection();
await db.dropDatabase();

let hashedPassword = await bcrypt.hash("password", 10);
await users.create("John Doe", "johndoe", hashedPassword);
await users.create("patrick hill", "nycSwag", hashedPassword);

await enterWeight("johndoe", 1000)
await enterWeight("johndoe", 10)
await enterWeight("johndoe", 100)

await enterWeight("nycSwag", 101)


console.log("Done seeding the database!");
await closeConnection();
