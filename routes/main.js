/**
 * The main routes for the application
 */

import { Router } from "express";
import * as middleware from "../utils/middleware.js";
import allModules from "../data/allModules.js";

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
      allModules,
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

  // Get the user and their modules
  let modules = req.session.user.modules;

  // Update the modules with the newly checked modules
  function updateModule(moduleName) {
    moduleName = eval(moduleName); // wow i cant believe i remembered this at 2am lmfao

    if (moduleName) {
      if (!modules.includes(moduleName)) {
        modules.push(moduleName);
      } else {
        modules = modules.filter((x) => x !== moduleName);
      }
    }
  }

  for (let { tag } of allModules) {
    updateModule(tag);
  }

  res.render("modules", {
    title: "Home",
    user: req.session.user,
    allModules,
  });
});

export default router;
