/**
 * The main routes for the application
 */

import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
  try {
    if (req.session && req.session.loggedIn) {
      return res.render("homepage", { title: "Home", user: req.session.user });
    } else {
      return res.redirect("/signup");
    }
  } catch (e) {
    return res.status(500).json("Internal Server Error");
  }
});

export default router;
