/**
 * The dashboard routes for the application
 */

import { Router } from "express";
import * as middleware from "../utils/middleware.js";
import * as users from "../data/users.js"

const router = Router();

router.route("/").get(middleware.home, async (req, res) => {
  try {
    let user = await users.getByUsername(req.session.user.username);

    return res.render("dashboard", {
      title: "Dashboard",
      user: req.session.user,
      userData: user,
      editProfile: "hidden",
      editPassword: "hidden"
    });
  } catch (e) {
    return res.status(500).json("Internal Server Error");
  }
});

export default router;
