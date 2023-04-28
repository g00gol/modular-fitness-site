/**
 * The main routes for the application
 */

import { Router } from "express";
import * as middleware from "../utils/middleware.js";
import * as dataModules from "../data/index.js"
import allModules from "../data/allModules.js";

const router = Router();

router.route("/").get(middleware.root, (req, res) => {
  /**
   * You should not be here
   */
});

router.route("/modules").get(middleware.home, async (req, res) => {
  
  try {
    let allTimers = await dataModules.timers.getAll(req.session.username);
    let allCardio = await dataModules.cardio.getAll(req.session.username);
    
    return res.render("modules", {
      title: "Home",
      user: req.session.user,
      allModules,
      allTimers,
      allCardio,
    });
  } catch (e) {
    return res.redirect("/error" + "?500");
  }
});

router.route("/modules").post(middleware.home, (req, res) => {
  let {
    bloodSugarTracker,
    bodyWeightTracker,
    calorieTracker,
    cardioTracker,
    eventsCalendar,
    notepad,
    timer,
    workoutTracker,
  } = req.body;

  res.render("modules", {
    title: "Home",
    user: req.session.user,
  });
});

export default router;
