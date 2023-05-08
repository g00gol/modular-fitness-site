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

dotenv.config();

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uris = ["http://localhost:3000/modules/calendar/auth/callback"];

const router = Router();
router.get("/auth", async (req, res) => {
  let authUrl = await getAuthUrl(req.originalUrl);
  res.redirect(authUrl);
});

router.get("/auth/callback", async (req, res) => {
  let code = req.query.code;
  let tokens = await getAuthByCode(code);

  req.session.tokens = tokens;
  res.redirect("/modules/calendar");
});

router.get("/", async (req, res) => {
  let { tokens } = req.session;
  if (!tokens) {
    return res.redirect("/modules/calendar/auth");
  }

  // Create a new oAuth2Client instance with the session tokens
  const sessionOAuth2Client = new google.auth.OAuth2(
    clientID,
    clientSecret,
    redirect_uris[0]
  );

  sessionOAuth2Client.setCredentials(tokens);

  let calendar = google.calendar({ version: "v3", auth: sessionOAuth2Client });

  try {
    let { data } = await calendar.calendarList.list();
    let calendars = data.items;

    return res.render("calendar", {
      title: "Calendar",
      calendars,
      invalid: req.query?.invalid,
    });
  } catch (e) {
    return res.redirect("/error?status=500");
  }
});

router.get("/events", async (req, res) => {
  let { tokens } = req.session;
  if (!tokens) {
    return res.redirect("/modules/calendar/auth");
  }

  // Create a new oAuth2Client instance with the session tokens
  const sessionOAuth2Client = new google.auth.OAuth2(
    clientID,
    clientSecret,
    redirect_uris[0]
  );
  sessionOAuth2Client.setCredentials(tokens);

  let calendar = google.calendar({ version: "v3", auth: sessionOAuth2Client });

  // Get the calendar list
  let { data } = await calendar.calendarList.list();
  let calendars = data.items;

  // Get events from all calendars
  let allEvents = [];
  for (let calendarItem of calendars) {
    let calendarId = calendarItem.id;
    let eventsResponse = await calendar.events.list({ calendarId: calendarId });
    let events = eventsResponse.data.items;
    allEvents.push(...events);
  }

  let events = allEvents
    .map((event) => {
      if (event.status !== "cancelled") {
        return {
          id: event.id,
          title: event.summary,
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
        };
      }

      return;
    })
    .filter((event) => !!event);

  return res.status(200).json({ events });
});

router.post("/add-event", async (req, res) => {
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

  let startDateTimeISO = new Date(
    `${eventDate}T${eventStartTime}`
  ).toISOString();
  let endDateTimeISO = new Date(`${eventDate}T${eventEndTime}`).toISOString();

  let event = {
    summary: eventName,
    description: eventDescription,
    start: {
      dateTime: startDateTimeISO,
      timeZone: "America/New_York",
    },
    end: {
      dateTime: endDateTimeISO,
      timeZone: "America/New_York",
    },
  };

  try {
    let { data } = await calendar.events.insert({
      calendarId,
      resource: event,
    });

    return res.redirect("/modules/calendar");
  } catch (e) {
    return res.redirect("/error?status=500");
  }
});

export default router;
