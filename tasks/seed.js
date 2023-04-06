import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users } from "../data/index.js";

const db = await dbConnection();
await db.dropDatabase();

await users.create("John Doe", "johndoe", "password");

console.log("Done seeding the database!");
await closeConnection();
