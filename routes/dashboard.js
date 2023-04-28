/**
 * The dashboard routes for the application
 */

import { Router } from "express";
import * as middleware from "../utils/middleware.js";

const router = Router();

router.route("/").get(middleware.home, (req, res) => {
  try {
    return res.render("dashboard", {
      title: "Dashboard",
      user: req.session.user,
    });
  } catch (e) {
    return res.status(500).json("Internal Server Error");
  }
});

export default router;
