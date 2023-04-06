import { Router } from "express";
import bcrypt, { hash } from "bcrypt";

import { users } from "../data/index.js";
import * as validation from "../helpers.js";

/**
 * Login route
 */
const loginRouter = Router();
loginRouter
  .route("/")
  .get((req, res) => {
    try {
      return res.render("login", { error: "" });
    } catch (e) {
      return res.status(500).json("Internal Server Error");
    }
  })
  .post((req, res) => {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.render("login", { error: "One or more fields invalid." });
    }

    username = username.trim();

    try {
    } catch (e) {}
  });

/**
 * Signup route
 */
const signupRouter = Router();
signupRouter
  .route("/")
  .get((req, res) => {
    try {
      return res.render("signup", { error: "" });
    } catch (e) {
      return res.status(500).json("Internal Server Error");
    }
  })
  .post(async (req, res) => {
    let { name, username, password, retypePassword } = req.body;
    if (!name || !username || !password || !retypePassword) {
      return res.render("signup", {
        name,
        username,
        error: "One or more fields invalid.",
      });
    }

    name = name.trim();
    username = username.trim();

    if (password !== retypePassword) {
      return res.render("signup", {
        username,
        error: "Passwords do not match.",
      });
    }

    try {
      // Hash the password
      let hashedPassword = await bcrypt.hash(password, 10);
      await users.create(name, username, hashedPassword);
      return res.redirect("/login");
    } catch (e) {
      return res.status(500).json("Internal Server Error");
    }
  });

export { loginRouter, signupRouter };
