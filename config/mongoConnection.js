import { MongoClient } from "mongodb";

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(
      process.env.MONGO_URI ?? "mongodb://localhost:27017"
    );
    _db = _connection.db(process.env.MONGO_DB_NAME ?? "mode-fitness");
  }

  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

export { dbConnection, closeConnection };
