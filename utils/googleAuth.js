import { google } from "googleapis";
const { OAuth2 } = google.auth;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

const clientID = process.env.GOOGLE_CLIENT_ID;
console.log(process.env.GOOGLE_CLIENT_ID);
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uris = ["http://localhost:3000/modules"];

const oAuth2Client = new OAuth2(
  clientID,
  clientSecret,
  redirect_uris[0]
);

export async function getAuthUrl(requestURL) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    state: requestURL,
    scope: SCOPES,
  });
  return authUrl; // redirect user to the url
}
export async function getAuthByCode(code) {
  const data = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(data.tokens);
  return oAuth2Client;
}
export async function getAuthByRefreshToken(refreshToken) {
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  return oAuth2Client;
}
