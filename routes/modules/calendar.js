import { Router } from "express";
import dotenv from "dotenv";
import {
  getAuthUrl,
  getAuthByCode,
  getAuthByRefreshToken,
} from "../../utils/googleAuth.js";
import { google } from "googleapis";
import moment from "moment";

import * as validation from "../../public/js/moduleValidation.js";
import * as calendarData from "../../data/calendar.js";

dotenv.config();

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uris = ["http://localhost:3000/modules/calendar/auth/callback"];

const router = Router();
router.route("/auth").get(async (req, res) => {
  let authUrl = await getAuthUrl(req.originalUrl);
  res.redirect(authUrl);
});

router.route("/auth/callback").get(async (req, res) => {
  let code = req.query.code;
  let tokens = await getAuthByCode(code);

  req.session.tokens = tokens;
  res.redirect("/modules/calendar");
});

router.route("/").get(async (req, res) => {
  let { tokens } = req.session;
  if (!tokens) {
    return res.redirect("/modules/calendar/auth");
  }

  try {
    return res.render("calendar", {
      title: "Calendar",
      invalid: req.query?.invalid,
    });
  } catch (e) {
    return res.redirect("/error?status=500");
  }
});

router.route("/events").get(async (req, res) => {
  let isClientSideRequest = req.header("X-Client-Side-Request") === "true";
  if (!isClientSideRequest) {
    return res.redirect("/error?status=403");
  }

  let { tokens } = req.session;
  if (!tokens) {
    return res.redirect("/modules/calendar/auth");
  }

  // Get all events
  try {
    let events = await calendarData.getAllEvents(tokens);
    return res.status(200).json({ events });
  } catch (e) {
    return res.redirect("/error?status=500");
  }
});

router.route("/add-event").post(async (req, res) => {
  let { tokens } = req.session;
  if (!tokens) {
    res.redirect("/modules/calendar/auth");
    return;
  }

  // Create a new oAuth2Client instance with the session tokens
  const sessionOAuth2Client = new google.auth.OAuth2(
    clientID,
    clientSecret,
    redirect_uris[0]
  );
  sessionOAuth2Client.setCredentials(tokens);

  let calendar = google.calendar({ version: "v3", auth: sessionOAuth2Client });

  let calendarName = "mode-fitness";
  let calendarId;

  try {
    let { data } = await calendar.calendarList.list();
    let existingCalendar = data.items.find(
      (calendar) => calendar.summary === calendarName
    );

    if (existingCalendar) {
      calendarId = existingCalendar.id;
    } else {
      let { data } = await calendar.calendars.insert({
        requestBody: {
          summary: calendarName,
        },
      });
      calendarId = data.id;
    }

    req.session.calendarId = calendarId;
  } catch (e) {
    return res.redirect("/modules/calendar?invalid=true");
  }

  let { eventName, eventDescription, eventDate, eventStartTime, eventEndTime } =
    req.body;

  // Check if params exist and are strings
  try {
    validation.paramExists({
      eventName,
      eventDate,
      eventStartTime,
      eventEndTime,
    });
    validation.paramIsString({
      eventName,
      eventDate,
      eventStartTime,
      eventEndTime,
    });
  } catch (e) {
    return res.redirect("/modules/calendar?invalid=true");
  }

  // Validate eventDate
  if (!moment(eventDate, "YYYY-MM-DD", true).isValid()) {
    return res.redirect("/modules/calendar?invalid=true");
  }

  // Validate time format
  let timeRegex = /([01][0-9]|[02][0-3]):[0-5][0-9]/;
  if (!timeRegex.test(eventStartTime) || !timeRegex.test(eventEndTime)) {
    return res.redirect("/modules/calendar?invalid=true");
  }

  // Check if eventStartTime is before eventEndTime
  let eventStartTimeDate = new Date(`01/01/2000 ${eventStartTime}`);
  let eventEndTimeDate = new Date(`01/01/2000 ${eventEndTime}`);
  if (eventStartTimeDate > eventEndTimeDate) {
    return res.redirect("/modules/calendar?invalid=true");
  }

  // If eventDescription is not empty, check if it's a string
  if (eventDescription.trim().length > 0) {
    try {
      validation.paramIsString({
        eventDescription,
      });
    } catch (e) {
      return res.redirect("/modules/calendar?invalid=true");
    }
  }

  try {
    let event = await calendarData.addEvent(
      calendar,
      calendarId,
      eventName,
      eventDescription,
      eventDate,
      eventStartTime,
      eventEndTime
    );

    return res.redirect("/modules/calendar");
  } catch (e) {
    if (e.invalid) {
      return res.redirect("/modules/calendar?invalid=true");
    } else {
      return res.redirect("/error?status=500");
    }
  }
});

// Gets the events for the current day and the next day
router.route("/upcoming-events").get(async (req, res) => {
  let { tokens } = req.session;
  if (!tokens) {
    res.redirect("/modules/calendar/auth");
    return;
  }

  try {
    // Get the upcoming events function
    let upcomingEvents = await calendarData.getUpcomingEvents(tokens);

    return res.status(200).json({ upcomingEvents });
  } catch (e) {
    if (e.invalid) {
      return res.redirect("/modules/calendar?invalid=true");
    } else {
      return res.redirect("/error?status=500");
    }
  }
});

export default router;
