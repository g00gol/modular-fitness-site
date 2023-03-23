const constructorMethod = (app) => {
  app.use("/", (req, res) => {
    res.render("index", { title: "Mode Fitness" });
  });
};

export default constructorMethod;
