/**
 * Routes for user authentication
 */

import { Router } from "express";
import bcrypt, { hash } from "bcrypt";
import session from "express-session";

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
  .post(async (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.render("login", { error: "One or more fields invalid." });
    }

    username = username.trim();

    try {
      var user = await users.getByUsername(username);
    } catch (e) {
      return res.render("login", { error: "Invalid username or password." });
    }

    let auth = await bcrypt.compare(password, user.password);
    if (auth) {
      req.session.user = user.name;
      console.log("login", req.session);
      return res.redirect("/dashboard");
    } else {
      res.render("login", { error: "Invalid username or password." });
    }
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
