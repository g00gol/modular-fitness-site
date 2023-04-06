/**
 * The dashboard routes for the application
 */

import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
  try {
    console.log(req.session);
    return res.render("dashboard", {
      title: "Dashboard",
      user: req.session.user,
    });
  } catch (e) {
    return res.status(500).json("Internal Server Error");
  }
});

export default router;
