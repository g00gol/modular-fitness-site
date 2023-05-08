import { Router } from "express";
import bcrypt, { hash } from "bcrypt";
import xss from "xss";

import * as users from "../../data/users.js";
import * as middleware from "../../utils/middleware.js";
import { getAllWeightsObj } from "../../data/weight.js";
import session from "express-session";

const weightRouter = Router();
weightRouter.route("/weight").post(middleware.authAPI, async (req, res) => {
  let user;
  try {
    user = await users.getByUsername(req.session.user.username);
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
  try {
    let data = await getAllWeightsObj(req.session.user.username);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export { weightRouter };
