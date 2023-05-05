import { Router } from "express";
import dotenv from "dotenv";
import {
  getAuthUrl,
  getAuthByCode,
  getAuthByRefreshToken,
} from "../../utils/googleAuth.js";
import { google } from "googleapis";

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
  let { data } = await calendar.calendarList.list();
  let calendars = data.items;

  res.render("calendar", { calendars });
});

export default router;
