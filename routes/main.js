/**
 * The main routes for the application
 */

import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
  try {
    return res.render("homepage", { title: "Home" });
  } catch (e) {
    return res.status(500).json("Internal Server Error");
  }
});

export default router;
