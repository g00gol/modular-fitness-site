import { Router } from "express";


import * as users from "../../data/users.js";
import * as middleware from "../../utils/middleware.js";
import { getAll } from "../../data/cardio.js";

const cardioRouter = Router();
cardioRouter.route("/cardio").post(middleware.authAPI, async (req, res) => {
  let user;
  try {
    user = await users.getByUsername(req.session.user.username);
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
  try {
    let data = await getAll(req.session.user.username);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export { cardioRouter };
