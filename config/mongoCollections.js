import { dbConnection } from "./mongoConnection.js";

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

/* Now, you can list your collections here: */
export const users = getCollectionFn("users");
export const cardio = getCollectionFn("cardio");
export const timers = getCollectionFn("timers");
export const weights = getCollectionFn("weights");
export const sugar = getCollectionFn("sugar");
export const calories = getCollectionFn("calories");
export const notes = getCollectionFn("notes");
