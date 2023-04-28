import express from "express";
import session from "express-session";
import exphbs from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import configRoutes from "./routes/index.js";
import * as middleware from "./utils/middleware.js";

dotenv.config({ path: "./.env" });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

app.use(
  session({
    name: "AuthCookie",
    secret: "schrodingers cat",
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false },
  })
);

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

const hbs = exphbs.create({});

// Helper function to register partials
function registerPartials(dir, hbsInstance) {
  fs.readdirSync(dir).forEach((file) => {
    const fileName = path.basename(file, ".handlebars");
    const partial = fs.readFileSync(path.join(dir, file), "utf8");
    const partialPath = path.relative(
      path.join(__dirname, "views/partials"),
      dir
    );
    hbsInstance.registerPartial(`${partialPath}/${fileName}`, partial);
  });
}

const modulesPath = path.join(__dirname, "views/partials/modules");
const panelsPath = path.join(__dirname, "views/partials/panels");

registerPartials(modulesPath, hbs.handlebars);
registerPartials(panelsPath, hbs.handlebars);

hbs.handlebars.registerPartial(
  "module",
  fs.readFileSync(
    path.join(__dirname, "views/partials/module.handlebars"),
    "utf8"
  )
);

// Custom handlebar function to dynamically render a partial from views/partials/modules
hbs.handlebars.registerHelper("renderModule", function (module, options) {
  if (!module || !options) return `${module} not found`;

  let partial = hbs.handlebars.partials[`modules/${module}`];
  if (!partial) return `${module} not found`;

  let compile = hbs.handlebars.compile(partial);
  return new hbs.handlebars.SafeString(compile(this));
});

// Custom handlebar function to check if an array contains an item
hbs.handlebars.registerHelper("ifContains", function (arr, item, options) {
  if (!arr || !item || !options) return;
  if (!Array.isArray(arr)) return;

  if (arr.includes(item)) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.use(middleware.logging);
configRoutes(app);

app.listen(3000, () => {
  console.log("Server started running on http://localhost:3000");
});
