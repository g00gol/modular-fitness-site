import { Router } from "express";


import * as users from "../../data/users.js";
import * as middleware from "../../utils/middleware.js";
import { getCaloriesByUserID } from "../../data/calories.js";

const calorieRouter = Router();
calorieRouter.route("/calorie").post(middleware.authAPI, async (req, res) => {
  let userId;
  try {
    userId = (await users.getByUsername(req.session.user.username))._id;
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
  try {
    let data = await getCaloriesByUserID(userId);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export { calorieRouter };
