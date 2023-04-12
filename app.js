import express from "express";
import exphbs from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import configRoutes from "./routes/index.js";

dotenv.config({ path: "./.env" });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    partialsDir: ["views/partials/"],
  })
);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("Server started running on http://localhost:3000");
});
