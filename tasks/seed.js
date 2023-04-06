import bcrypt from "bcrypt";

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users } from "../data/index.js";

const db = await dbConnection();
await db.dropDatabase();

let hashedPassword = await bcrypt.hash("password", 10);
await users.create("John Doe", "johndoe", hashedPassword);

console.log("Done seeding the database!");
await closeConnection();
