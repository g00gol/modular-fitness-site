import userRoutes from "./users.js";

const constructorMethod = (app) => {
  app.use("/", userRoutes);

  app.use("*", (req, res) => {
    console.log("error");
    res.status(404).render("error", { errorCode: 404, errorText: "Not Found" });
  });
};

export default constructorMethod;
