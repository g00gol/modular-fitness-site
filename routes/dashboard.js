/**
 * The dashboard routes for the application
 */

import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
  try {
    // console.log(req.session);
    if (req.session && req.session.loggedIn) {
      return res.render("dashboard", {
        title: "Dashboard",
        user: req.session.user,
      });
    } else {
      return res.redirect("/login");
    }
  } catch (e) {
    return res.status(500).json("Internal Server Error");
  }
});

export default router;
