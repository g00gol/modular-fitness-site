import session from "express-session";

import mainRoutes from "./main.js";
import * as userRoutes from "./users.js";
import dashboardRoutes from "./dashboard.js";
import sugarRoutes from "./api/sugar.js"

const constructorMethod = (app) => {
  app.use(
    session({
      name: "AuthCookie",
      secret: "secret-key",
      saveUninitialized: false,
      resave: false,
      cookie: { secure: false },
    })
  );

  app.use("/", mainRoutes);
  app.use("/login", userRoutes.loginRouter);
  app.use("/signup", userRoutes.signupRouter);
  app.use("/dashboard", dashboardRoutes);
  app.use("/api", sugarRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("error", { errorCode: 404, errorText: "Not Found" });
  });
};

export default constructorMethod;
