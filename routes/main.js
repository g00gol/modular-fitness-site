/**
 * The main routes for the application
 */

import { Router } from "express";
import * as middleware from "../utils/middleware.js";
import * as dataModules from "../data/index.js"
//import allModules from "../data/allModules.js";
import * as users from "../data/users.js";
//import * as workouts from "../data/workouts.js";
import workoutsRoutes from "./modules/workouts.js";
import weightRoutes from "./modules/weight.js";
import sugarRoutes from "./modules/sugar.js"
import cardioRoutes from "./modules/cardio.js";
import timerRoutes from "./modules/timers.js";

import allModules from "../public/constants/allModules.js";

const router = Router();

router.route("/").get(middleware.root, (req, res) => {
  /**
   * You should not be here
   */
});

router.route("/modules").get(middleware.home, async (req, res) => {
  let user = await users.getByUsername(req.session.user.username);
  if (!user) {
    return res.redirect("/error?status=500");
  }
  req.session.user.enabledModules = user.enabledModules;

  let allWorkouts = [];
  try {
    allWorkouts = await dataModules.workouts.getWorkouts(req.session.user.uid);
  } catch (e) {
    return res.redirect("/error?status=500");
  }

  try {
    let allTimers = await dataModules.timers.getAll(req.session.user.username);
    let allCardio = await dataModules.cardio.getAll(req.session.user.username);
    
    return res.render("modules", {
      title: "Home",
      user: req.session.user,
      allModules,
      allTimers,
      allCardio,
      enabledModules: req.session.user.enabledModules,
      invalid: req.query?.invalid,
      allWorkouts,
    });
  } catch (e) {
    return res.redirect("/error?status=500");
  }
});

router.route("/modules").post(middleware.home, async (req, res) => {
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
  let newModules = [];

  // Update the modules with the newly checked modules
  function updateModule(moduleName) {
    moduleName = eval(moduleName); // wow i cant believe i remembered this at 2am lmfao

    let temp = [];
    if (moduleName) {
      // Make sure the module value matches one of the allModules
      if (!allModules.find((module) => module.tag === moduleName)) {
        throw 400;
      }

      temp.push(moduleName);
    }

    return temp;
  }

  for (let { tag } of allModules) {
    try {
      newModules.push(...updateModule(tag));
    } catch (e) {
      return res.redirect(`/error?status=${e}`);
    }
  }

  // Update the user's modules
  let updatedUser = await users.updateEnabledModulesByUsername(
    req.session.user.username,
    newModules
  );
  if (!updatedUser.updated) {
    return res.redirect("/error?status=500");
  }

  req.session.user.enabledModules = newModules;

  return res.redirect("/modules");
});

router.use("/modules/workouts", middleware.home, workoutsRoutes);
router.use("/modules/*", (req, res) => {
  return res.redirect("/error?status=404");
});

export default router;
