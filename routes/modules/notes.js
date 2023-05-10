import { Router } from "express";
import xss from "xss";

import * as notes from "../../data/notes.js";
import * as validation from "../../public/js/moduleValidation.js";
import * as helpers from "../../utils/helpers.js";
import moment from "moment";

const router = Router();

const checkNote = (title, text) => {
  helpers.invalidParams(title, text);

  if (!text) {
    text = "";
  } else if (typeof text !== "string") {
    throw [400, "note body must be a string"];
  } else if (typeof title !== "string") {
    throw [400, "note title must be a string"];
  } else if (title.length > 75) {
    throw [400, "note title too long"];
  } else if (text.length > 25000) {
    throw [400, "note text too long"];
  }

  if ((!title || title.trim().length === 0) && text.length === 0) {
    throw [400, "no title or text provided"];
  }
};

router.route("/").post(async (req, res) => {
  let { uid, username } = req.session.user;
  // Check if userId and username are valid
  try {
    validation.paramExists({ uid, username });
    validation.paramIsString({ uid, username });
  } catch (e) {
    if (e.invalid) {
      return res.redirect("/error?status=400");
    } else {
      return res.redirect("/error?status=500");
    }
  }

  let { title, text } = req.body;
  title = xss(title);
  text = xss(text);
  // Check if workoutName and workoutDay are valid
  try {
    checkNote(title, text);
  } catch (e) {
    return res.redirect("/modules?invalid=true");
  }

  // store note object in database
  try {
    await notes.enterNote(uid, username, moment().toISOString(), title, text);
  } catch (e) {
    return res.redirect(`/error?status=${e[0]}`);
  }

  return res.redirect("/modules");
});

router.route("/:noteID").get(async (req, res) => {
  let isClientSideRequest = req.header("X-Client-Side-Request") === "true";
  if (!isClientSideRequest) {
    return res.redirect("/error?status=403");
  }

  let uid = req.session.user.uid;

  try {
    helpers.invalidParams(uid);
    uid = helpers.invalidID(uid);
  } catch (e) {
    return res.json({ error: e[1] });
  }

  let { noteID } = req.params;

  try {
    helpers.invalidParams(noteID);
    noteID = helpers.invalidID(noteID);
  } catch (e) {
    return res.json({ error: e[1] });
  }

  // Check if the note exists
  let note;
  try {
    note = await notes.getNoteByID(noteID);
  } catch (e) {
    return res.json({ error: e[1] });
  }

  // IMPORTANT: make sure the current user is the owner of the note
  if (note.userID !== uid) {
    return res.json({ error: "User mismatch!" });
  }

  return res.json(note);
});

router.route("/:noteID").post(async (req, res) => {
  let { uid, username } = req.session.user;
  // Check if userId and username are valid
  try {
    validation.paramExists({ uid, username });
    validation.paramIsString({ uid, username });
  } catch (e) {
    if (e.invalid) {
      return res.redirect("/error?status=400");
    } else {
      return res.redirect("/error?status=500");
    }
  }

  let { noteID } = req.params;
  // Check if noteID is valid
  try {
    validation.paramExists({ noteID });
    validation.paramIsString({ noteID });
  } catch (e) {
    if (e.invalid) {
      return res.redirect("/error?status=400");
    } else {
      return res.redirect("/error?status=500");
    }
  }

  // Check if uid and noteId are a valid ObjectIds
  try {
    uid = helpers.invalidID(uid);
    noteID = helpers.invalidID(noteID);
  } catch (e) {
    return res.redirect("/error?status=400");
  }

  // Check if the note exists
  let note;
  try {
    note = await notes.getNoteByID(noteID);
  } catch (e) {
    return res.redirect("/error?status=500");
  }

  // IMPORTANT: make sure the current user is the owner of the calorie
  if (note.userID !== uid) {
    return res.redirect("/error?status=403");
  }

  let { title, text } = req.body;
  title = xss(title);
  text = xss(text);
  // Check if workoutName and workoutDay are valid
  try {
    checkNote(title, text);
  } catch (e) {
    return res.redirect("/modules?invalid=true");
  }

  // store note object in database
  try {
    await notes.updateNote(noteID, moment().toISOString(), title, text);
  } catch (e) {
    return res.redirect(`/error?status=${e[0]}`);
  }

  return res.redirect("/modules");
});

export default router;
