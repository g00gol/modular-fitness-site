/**
 * The main routes for the application
 */

import { Router } from "express";
import * as middleware from "../utils/middleware.js";
import * as users from "../data/users.js";
import allModules from "../public/allModules.js";

const router = Router();

router.route("/").get(middleware.root, (req, res) => {
  /**
   * You should not be here
   */
});

router.route("/modules").get(middleware.home, async (req, res) => {
  let user = await users.getByUsername(req.session.user.username);
  if (!user) {
    return res.redirect("/error" + "?500");
  }
  req.session.user.enabledModules = user.enabledModules;

  try {
    return res.render("modules", {
      title: "Home",
      user: req.session.user,
      allModules,
      enabledModules: req.session.user.enabledModules,
    });
  } catch (e) {
    return res.redirect("/error" + "?500");
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
    return res.redirect("/error" + "?500");
  }

  req.session.user.enabledModules = newModules;

  res.render("modules", {
    title: "Home",
    user: req.session.user,
    allModules,
    enabledModules: req.session.user.enabledModules,
  });
});

export default router;
