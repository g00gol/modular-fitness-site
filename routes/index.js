import session from "express-session";
import http from "http";

import mainRoutes from "./main.js";
import * as userRoutes from "./users.js";
import dashboardRoutes from "./dashboard.js";
import * as sugarAPIRoutes from "./api/sugar.js";
import * as weightAPIRoutes from "./api/weight.js";
import * as cardioAPIRoutes from "./api/cardio.js";
import userDataRoutes from "./userData.js"

import * as middleware from "../utils/middleware.js";

const constructorMethod = (app) => {
  app.use("/", mainRoutes);
  app.use("/login", middleware.noCache, userRoutes.loginRouter);
  app.use("/signup", middleware.noCache, userRoutes.signupRouter);
  app.use("/dashboard", dashboardRoutes);
  app.use("/logout", userRoutes.logoutRouter);
  app.use("/myData", middleware.myData ,userDataRoutes);

  app.use("/error", async (req, res) => {
    let statusCode = Number(req.query?.status) || 404;
    if (statusCode < 400 || statusCode > 599) {
      statusCode = 404;
    }
    let statusMsg = http.STATUS_CODES[statusCode];

    res
      .status(statusCode)
      .render("error", {
        title: "Error",
        error: [statusCode, statusMsg],
        disableNav: true,
      });
  });

  // API routes
  app.use("/api", [sugarAPIRoutes.sugarRouter, weightAPIRoutes.weightRouter, cardioAPIRoutes.cardioRouter]);

  app.use("*", (req, res) => {
    res.redirect("error" + "?404");
  });
};

export default constructorMethod;
