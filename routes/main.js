/**
 * The main routes for the application
 */

import { Router } from "express";
import * as middleware from "../utils/middleware.js";
import * as dataModules from "../data/index.js";
//import allModules from "../data/allModules.js";
import * as users from "../data/users.js";
//import * as workouts from "../data/workouts.js";
import workoutsRoutes from "./modules/workouts.js";
import calendarRoutes from "./modules/calendar.js";
import cardioRoutes from "./modules/cardio.js";
import timerRoutes from "./modules/timers.js";
import calorieRoutes from "./modules/calories.js";
import noteRoutes from "./modules/notes.js";
import weightRoutes from "./modules/weight.js";
import sugarRoutes from "./modules/sugar.js";

import profileRoutes from "./profile.js";

import allModules from "../public/constants/allModules.js";
import { moduleGetName } from "../utils/helpers.js";

const router = Router();

router.route("/").get(middleware.root, (req, res) => {
  /**
   * You should not be here
   */
});

router.route("/modules").get(middleware.home, async (req, res) => {
  let user = await users.getByUsername(req.session.user.username);
  if (!user || !user.enabledModules) {
    return res.redirect("/error?status=500");
  }
  req.session.user.enabledModules = user.enabledModules;

  let allWorkouts = [];
  if (req.session.user.enabledModules.includes("workoutTracker")) {
    try {
      allWorkouts = await dataModules.workouts.getWorkouts(
        req.session.user.uid
      );
    } catch (e) {
      console.log(e);
      return res.redirect("/error?status=500");
    }
  }

  let allCardio = [];

  if (req.session.user.enabledModules.includes("cardioTracker")) {
    try {
      allCardio = await dataModules.cardio.getAll(req.session.user.username);
    } catch (e) {
      console.log(e);
      return res.redirect("/error?status=500");
    }
  }

  let allTimers = [];

  if (req.session.user.enabledModules.includes("timer")) {
    try {
      allTimers = await dataModules.timers.getAll(req.session.user.username);
    } catch (e) {
      console.log(e);
      return res.redirect("/error?status=500");
    }
  }

  let enabledModules = [];
  let enabledTags = req.session.user.enabledModules;
  for (let i = 0; i < enabledTags.length; i++) {
    enabledModules.push({
      name: moduleGetName(enabledTags[i]),
      tag: enabledTags[i],
    });
  }

  let allCalories = [];

  if (req.session.user.enabledModules.includes("calorieTracker")) {
    try {
      allCalories = await dataModules.calories.getCaloriesByUserID(
        req.session.user.uid
      );
    } catch (e) {
      console.log(e);
      return res.redirect("/error?status=500");
    }
  }

  let allNotes = [];

  if (req.session.user.enabledModules.includes("notepad")) {
    try {
      allNotes = await dataModules.notes.getNotesByUserID(req.session.user.uid);
    } catch (e) {
      console.log(e);
      return res.redirect("/error?status=500");
    }
  }

  let eventsCalendar = { auth: true, upcoming: [] };
  if (req.session.user.enabledModules.includes("eventsCalendar")) {
    if (!req.session.tokens) {
      eventsCalendar.auth = false;
    } else {
      try {
        eventsCalendar.upcoming = await dataModules.calendar.getUpcomingEvents(
          req.session.tokens
        );
      } catch (e) {
        console.log(e);
        return res.redirect("/error?status=500");
      }
    }
  }

  try {
    return res.render("modules", {
      title: "Home",
      user: req.session.user,
      allModules,
      allTimers,
      allCardio,
      enabledModules: enabledModules,
      invalid: req.query?.invalid,
      allWorkouts,
      allCalories,
      allNotes,
      eventsCalendar,
    });
  } catch (e) {
    return res.redirect("/error?status=500");
  }
});

router.route("/modules").post(middleware.home, async (req, res) => {
  let newModules = req.body.modules;
  if (!newModules) {
    req.session.user.enabledModules = [];

    // Update the user's modules
    let updatedUser = await users.updateEnabledModulesByUsername(
      req.session.user.username,
      []
    );
    if (!updatedUser.updated) {
      return res.redirect("/error?status=500");
    }
    return res.redirect("/modules");
  }

  let validTags = [];
  for (let i = 0; i < allModules.length; i++) {
    validTags.push(allModules[i].tag);
  }

  for (let i = 0; i < newModules.length; i++) {
    if (!validTags.includes(newModules[i])) {
      return res.redirect("/error?status=500");
    }
  }

  let checkDuplicates = (arr) => {
    let isDuplicate = (elem, ind) => {
      let index = arr.indexOf(elem);
      return index !== ind;
    };
    let length = arr.filter(isDuplicate).length;
    return length > 0;
  };

  if (checkDuplicates(newModules)) {
    return res.redirect("/error?status=500");
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

  //return window.location.href = "/modules"
  return res.redirect("/modules");
});

router.route("/modules/enabled").get(middleware.home, async (req, res) => {
  const enabledModules = req.session.user.enabledModules.join("\n");
  res.send(enabledModules);
});

router.use("/profile/", middleware.home, profileRoutes);
router.use("/modules/workouts", middleware.home, workoutsRoutes);
router.use("/modules/calendar", middleware.home, calendarRoutes);
router.use("/modules/cardio", middleware.home, cardioRoutes);
router.use("/modules/timers", middleware.home, timerRoutes);
router.use("/modules/calories", middleware.home, calorieRoutes);
router.use("/modules/notes", middleware.home, noteRoutes);
router.use("/modules/weight", middleware.home, weightRoutes);
router.use("/modules/sugar", middleware.home, sugarRoutes);
router.use("/modules/*", (req, res) => {
  return res.redirect("/error?status=404");
});

export default router;
