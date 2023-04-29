import { ObjectId } from "mongodb";
import { notes } from "../config/mongoCollections.js";
import { getByUsername } from "./users.js";
import moment from "moment";
import { invalidNum, invalidStrings, invalidNum } from "../utils/helpers.js";

export const enterNote = async (username, datetime, title, text) => {
    // enter a new note into the database
    // input is a username, a timestamp, a title, and some text
    // if no title is provided, we default to "Untitled Note"
    // if title aleady exists in collection, we append a number to it (ie "Untitled Note(1)")
    // text is allowed to be empty or consist of only whitespace, so it will not be trimmed
    // basically, we only throw if both the title and the text are not given or are all whitespace

    invalidParams(username, datetime);

    invalidStrings(username);
    await getByUsername(username); //make sure it exists

    if (!moment(dateTime).isValid()) {
        throw [400, "invalid datetime"];
    }

    if (!text) {
        text = "";
    } else if (typeof text !== "string") {
        throw [400, "note body must be a string"];
    }

    if ((!title || title.trim().length === 0) && text.trim().length === 0) {
        throw [400, "no title or text provided"];
    } else if (!title) {
        title = "Untitled Note";
    } else if (typeof title !== "string") {
        throw [400, "title must be a string"];
    } else if (title.trim().length === 0) {
        title = "Untitled Note";
    } else {
        title = title.trim();
    }

    // **********************************************************************************************************************************************************************
    // TODO: IMPLEMENT NUMBERING FOR DUPLICATE TITLES
    // **********************************************************************************************************************************************************************

    const noteEntry = {
        username: username.trim(),
        dateTime: datetime,
        title: title,
        text: text,
    };

    let noteCollection = await notes();

    let createInfo = await noteCollection.insertOne(noteEntry);
    if (!createInfo.acknowledged || !createInfo.insertedId)
        throw [500, "Error: could not add note"];

    noteEntry._id = createInfo.insertedId.toString();
    return noteEntry;
};

export const getNoteByUsername = async (username) => {
    // gets all the notes for a given username
    // returns as an array of note objects
    // if user has no notes it will return an empty array, not throw

    invalidParams(username);
    invalidStrings(username);
    await getByUsername(username); //make sure it exists

    let noteCollection = await notes();

    let noteEntries = await noteCollection
        .find({ username: username })
        .toArray();

    if (!noteEntries || noteEntries.length == 0) {
        return [];
    }

    entryIDToString = (entry) => {
        entry._id = entry._id.toString();
        return entry;
    };
    noteEntries = noteEntries.map(entryIDToString);

    return noteEntries;
};

export const getNoteByID = async (id) => {
    invalidParams(id);
    id = invalidID(id);

    let noteCollection = await notes();
    let note = await noteCollection.findOne({ _id: new ObjectId(id) });
    if (!note) {
        throw [400, "note not found"];
    }

    note._id = entry._id.toString();

    return note;
};

export const updateNote = async (id, title, text) => {
    // alows users to update a note
    // no one should ever have to update the username or datetime

    invalidParams(id);
    id = invalidID(id);

    if (!text) {
        text = "";
    } else if (typeof text !== "string") {
        throw [400, "note body must be a string"];
    }

    if ((!title || title.trim().length === 0) && text.trim().length === 0) {
        throw [400, "no title or text provided"];
    } else if (!title) {
        title = "Untitled Note";
    } else if (typeof title !== "string") {
        throw [400, "title must be a string"];
    } else if (title.trim().length === 0) {
        title = "Untitled Note";
    } else {
        title = title.trim();
    }

    // **********************************************************************************************************************************************************************
    // TODO: IMPLEMENT NUMBERING FOR DUPLICATE TITLES
    // **********************************************************************************************************************************************************************

    let noteCollection = await notes();
    let note = await noteCollection.findOne({ _id: new ObjectId(id) });
    if (!note) {
        throw [400, "note not found"];
    }

    note._id = entry._id.toString();

    const noteEntry = {
        username: note.username,
        dateTime: note.datetime,
        title: title,
        text: text,
    };

    let updatedInfo = await noteCollection.findOneAndReplace(
        { _id: new ObjectId(id) },
        calorieEntry,
        { returnDocument: "after" }
    );
    if (updatedInfo.lastErrorObject.n === 0) {
        throw Error("could not update note successfully");
    }

    updatedInfo.value._id = updatedInfo.value._id.toString();

    return updatedInfo.value;
};
