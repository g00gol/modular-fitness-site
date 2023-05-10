import * as validation from "../public/js/moduleValidation.js";
import dotenv from "dotenv";
import { google } from "googleapis";
import moment from "moment";
import xss from "xss";

dotenv.config();

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uris = ["http://localhost:3000/modules/calendar/auth/callback"];

const getAllEvents = async (tokens) => {
  try {
    validation.paramExists(tokens);
    if (typeof tokens !== "object") {
      throw ["tokens"];
    }
  } catch (e) {
    throw e;
  }

  // Create a new oAuth2Client instance with the session tokens
  const sessionOAuth2Client = new google.auth.OAuth2(
    clientID,
    clientSecret,
    redirect_uris[0]
  );
  sessionOAuth2Client.setCredentials(tokens);

  try {
    let calendar = google.calendar({
      version: "v3",
      auth: sessionOAuth2Client,
    });

    let { data } = await calendar.calendarList.list();
    let calendars = data.items;

    // Get events from all the calendars
    let allEvents = [];
    for (let calendarItem of calendars) {
      let calendarId = calendarItem.id;
      let res = await calendar.events.list({ calendarId: calendarId });
      let events = res.data.items;
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

    return events;
  } catch (e) {
    throw { serverError: e };
  }
};

async function addEvent(
  calendar,
  calendarId,
  eventName,
  eventDescription,
  eventDate,
  eventStartTime,
  eventEndTime
) {
  // Check if params exist and are strings
  try {
    validation.paramExists({
      calendar,
      calendarId,
      eventName,
      eventDate,
      eventStartTime,
      eventEndTime,
    });
    validation.paramIsString({
      calendarId,
      eventName,
      eventDate,
      eventStartTime,
      eventEndTime,
    });
  } catch (e) {
    throw { invalid: true };
  }

  // Sanitize inputs
  eventName = xss(eventName);
  eventDescription = xss(eventDescription);
  eventDate = xss(eventDate);
  eventStartTime = xss(eventStartTime);
  eventEndTime = xss(eventEndTime);

  // Validate eventDate
  if (!moment(eventDate, "YYYY-MM-DD", true).isValid()) {
    throw { invalid: true };
  }

  // Validate time format
  let timeRegex = /([01][0-9]|[02][0-3]):[0-5][0-9]/;
  if (!timeRegex.test(eventStartTime) || !timeRegex.test(eventEndTime)) {
    throw { invalid: true };
  }

  // Check if eventStartTime is before eventEndTime
  let eventStartTimeDate = new Date(`01/01/2000 ${eventStartTime}`);
  let eventEndTimeDate = new Date(`01/01/2000 ${eventEndTime}`);
  if (eventStartTimeDate > eventEndTimeDate) {
    throw { invalid: true };
  }

  // If eventDescription is not empty, check if it's a string
  if (eventDescription.trim().length > 0) {
    try {
      validation.paramIsString({
        eventDescription,
      });
    } catch (e) {
      throw { invalid: true };
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

    return { insertedEvent: data };
  } catch (e) {
    throw { serverError: e };
  }
}

async function getUpcomingEvents(tokens) {
  try {
    validation.paramExists(tokens);
    if (typeof tokens !== "object") {
      throw ["token"];
    }
  } catch (e) {
    throw { invalid: true };
  }

  // Create a new oAuth2Client instance with the session tokens
  const sessionOAuth2Client = new google.auth.OAuth2(
    clientID,
    clientSecret,
    redirect_uris[0]
  );
  sessionOAuth2Client.setCredentials(tokens);

  let calendar = google.calendar({ version: "v3", auth: sessionOAuth2Client });

  // Get start of today and end of tomorrow
  let startOfToday = moment().startOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
  let endOfTomorrow = moment()
    .endOf("day")
    .add(1, "day")
    .format("YYYY-MM-DDTHH:mm:ssZ");

  try {
    let { data } = await calendar.calendarList.list();
    let calendars = data.items;

    // Get events from all the calendars
    let allEvents = [];
    for (let calendarItem of calendars) {
      let calendarId = calendarItem.id;
      let res = await calendar.events.list({
        calendarId,
        timeMin: startOfToday,
        timeMax: endOfTomorrow,
      });
      let events = res.data.items;
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

    return events;
  } catch (e) {
    throw { serverError: e };
  }
}

export { getAllEvents, addEvent, getUpcomingEvents };
