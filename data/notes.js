import { ObjectId } from "mongodb";
import { notes } from "../config/mongoCollections.js";
import { getByUsername } from "./users.js";
import moment from "moment";
import { invalidParams, invalidStrings, invalidID } from "../utils/helpers.js";

export const enterNote = async (userID, username, dateTime, title, text) => {
  // enter a new note into the database
  // the following input validation is in line with how apple notes works
  // input is a username, a timestamp, a title, and some text
  // if no title is provided, we default to "Untitled Note"
  // duplicate titles are allowed because they can be identified by date/time
  // text is allowed to be empty or consist of only whitespace, so only the title will be trimmed
  // we only throw if both the title and the text are not given
  invalidParams(userID, username, dateTime);
  invalidStrings(username, dateTime);
  userID = invalidID(userID);
  username = username.toLowerCase();
  await getByUsername(username); //make sure it exists

  if (!moment(dateTime).isValid()) {
    throw [400, "invalid datetime"];
  }

  if (!text) {
    text = "";
  } else if (typeof text !== "string") {
    throw [400, "note body must be a string"];
  } else if (typeof title !== "string") {
    throw [400, "note title must be a string"];
  }

  if ((!title || title.trim().length === 0) && text.length === 0) {
    throw [400, "no title or text provided"];
  } else if (!title || title.trim().length === 0) {
    title = "Untitled Note";
  } else {
    title = title.trim();
  }

  const noteEntry = {
    userID: userID,
    username: username.trim(),
    lastUpdated: dateTime,
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

export const getNotesByUserID = async (userID) => {
  // gets all the notes for a given username
  // returns as an array of note objects
  // if user has no notes it will return an empty array, not throw

  invalidParams(userID);
  userID = invalidID(userID);

  let noteCollection = await notes();

  let noteEntries = await noteCollection.find({ userID: userID }).toArray();

  if (!noteEntries || noteEntries.length == 0) {
    return [];
  }

  const entryIDToString = (entry) => {
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

  note._id = note._id.toString();

  return note;
};

export const updateNote = async (id, dateTime, title, text) => {
  // alows users to update a note
  // no one should ever have to update the username
  // datetime is last updated time

  invalidParams(id, dateTime);
  id = invalidID(id);
  invalidStrings(dateTime);

  if (!moment(dateTime).isValid()) {
    throw [400, "invalid datetime"];
  }

  if (!text) {
    text = "";
  } else if (typeof text !== "string") {
    throw [400, "note body must be a string"];
  } else if (typeof title !== "string") {
    throw [400, "note title must be a string"];
  }

  if ((!title || title.trim().length === 0) && text.length === 0) {
    throw [400, "no title or text provided"];
  } else if (!title || title.trim().length === 0) {
    title = "Untitled Note";
  } else {
    title = title.trim();
  }

  let noteCollection = await notes();
  let note = await noteCollection.findOne({ _id: new ObjectId(id) });
  if (!note) {
    throw [400, "note not found"];
  }

  note._id = note._id.toString();

  const noteEntry = {
    username: note.username,
    lastUpdated: dateTime,
    title: title,
    text: text,
  };

  let updatedInfo = await noteCollection.findOneAndReplace(
    { _id: new ObjectId(id) },
    noteEntry,
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw Error("could not update note successfully");
  }

  updatedInfo.value._id = updatedInfo.value._id.toString();

  return updatedInfo.value;
};

export const deleteNote = async (id) => {
  invalidParams(id);
  id = invalidID(id);

  let noteCollection = await notes();
  const deletionInfo = await noteCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (deletionInfo.lastErrorObject.n === 0) {
    throw Error(`Could not delete note with id of ${id}`);
  }

  return `${deletionInfo.value.title} has been successfully deleted!`;
};
