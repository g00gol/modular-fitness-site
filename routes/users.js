import { Router } from "express";
// import { user } from "../data/users.js";
import * as validation from "../helpers.js";

const router = Router();

router.route("/").get((req, res) => {
  try {
    return res.render("homepage", { title: "Home" });
  } catch (e) {
    return res.status(500).json("Internal Server Error");
  }
});

router
  .route("/login")
  .get((req, res) => {
    try {
      return res.render("login", { error: "" });
    } catch (e) {
      return res.status(500).json("Internal Server Error");
    }
  })
  .post((req, res) => {
    let { username } = req.body;
    username = username.trim;

    

    try {
    } catch (e) {}
  });

export default router;
