/**
 * The main routes for the application
 */

import { Router } from "express";
import * as middleware from "../utils/middleware.js";

const router = Router();

router.route("/").get(middleware.root, (req, res) => {
  /**
   * You should not be here
   */
});

router.route("/modules").get(middleware.home, (req, res) => {
  try {
    return res.render("modules", {
      title: "Home",
      user: req.session.user,
    });
  } catch (e) {
    return res.redirect("/error" + "?500");
  }
});

// router.route("")

export default router;
