import { Router } from "express";
import {
  getAuthUrl,
  getAuthByCode,
  getAuthByRefreshToken,
} from "../../utils/googleAuth";
import { google } from "googleapis";

const router = Router();
router.get("/auth", async (req, res) => {
  const authUrl = await getAuthUrl(req.originalUrl);
  res.redirect(authUrl);
});

router.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  const oAuth2Client = await getAuthByCode(code);

  req.session.oAuth2Client = oAuth2Client;
  res.redirect("/modules");
});

router.get("/", async (req, res) => {
  if (!req.session.oAuth2Client) {
    res.redirect("/modules/auth");
    return;
  }
  const oAuth2Client = req.session.oAuth2Client;
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const { data } = await calendar.calendarList.list();
  const calendars = data.items;
  console.log(calendars);

  res.render("modules/calendar", { calendars });
});
