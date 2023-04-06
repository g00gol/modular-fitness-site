import mainRoutes from "./main.js";
import { loginRouter, signupRouter } from "./users.js";

const constructorMethod = (app) => {
  app.use("/", mainRoutes);
  app.use("/login", loginRouter);
  app.use("/signup", signupRouter);

  app.use("*", (req, res) => {
    res.status(404).render("error", { errorCode: 404, errorText: "Not Found" });
  });
};

export default constructorMethod;
