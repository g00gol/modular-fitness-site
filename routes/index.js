import userRoutes from "./user.js";

const constructorMethod = (app) => {
  app.use("/", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
