import { Router } from "express";
import bcrypt, { hash } from "bcrypt";
import xss from "xss";

import * as users from "../../data/users.js";
import * as middleware from "../../utils/middleware.js";
import { getAllSugarObj } from "../../data/sugar.js";
import session from "express-session";

const sugarRouter = Router();
sugarRouter.route("/sugar").post(middleware.authAPI, async (req, res) => {
  let user;
  try {
    user = await users.getByUsername(req.session.user.username);
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
  try {
    let data = await getAllSugarObj(req.session.user.username);
    return data;
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export { sugarRouter };
