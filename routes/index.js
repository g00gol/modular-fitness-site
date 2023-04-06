import session from "express-session";

import mainRoutes from "./main.js";
import * as userRoutes from "./users.js";
import dashboardRoutes from "./dashboard.js";

const constructorMethod = (app) => {
  app.use(
    session({
      name: "",
      secret: "This is a secret.. shhh don't tell anyone",
      saveUninitialized: false,
      resave: false,
      cookie: { maxAge: 60000 },
    })
  );

  app.use("/", mainRoutes);
  app.use("/login", userRoutes.loginRouter);
  app.use("/signup", userRoutes.signupRouter);
  app.use("/dashboard", dashboardRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("error", { errorCode: 404, errorText: "Not Found" });
  });
};

export default constructorMethod;
