/**
 * Routes for user authentication
 */

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
      // If the user is already logged in, redirect to dashboard
      if (req.session && req.session.loggedIn) {
        return res.redirect("/dashboard");
      } else {
        return res.render("login", { error: "" });
      }
    } catch (e) {
      return res.status(500).json("Internal Server Error");
    }
  })
  .post(async (req, res) => {
    // Get the username and password from the request body and check if they are valid
    let { username, password } = req.body;
    if (!username || !password) {
      return res.render("login", { error: "One or more fields invalid." });
    }

    // Trim the username
    username = username.trim();

    // Check if the username exists in the database
    try {
      var user = await users.getByUsername(username);
    } catch (e) {
      return res.render("login", { error: "Invalid username or password." });
    }

    // Check if the password is correct
    let auth = await bcrypt.compare(password, user.password);

    // If the password is correct, set the session and redirect to dashboard
    if (auth) {
      // Set the session
      req.session.user = user.name;
      req.session.loggedIn = true;

      return res.redirect("/");
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
      // If the user is already logged in, redirect to dashboard
      if (req.session && req.session.loggedIn) {
        return res.redirect("/dashboard");
      } else {
        return res.render("signup");
      }
    } catch (e) {
      return res.status(500).json("Internal Server Error");
    }
  })
  .post(async (req, res) => {
    // Get the name, username, password and retypePassword from the request body and check if they are valid
    let { name, username, password, retypePassword } = req.body;
    if (!name || !username || !password || !retypePassword) {
      return res.render("signup", {
        name,
        username,
        error: "One or more fields invalid.",
      });
    }

    // Trim the name and username
    name = name.trim();
    username = username.trim();

    // Check if the passwords match
    if (password !== retypePassword) {
      return res.render("signup", {
        username,
        error: "Passwords do not match.",
      });
    }

    try {
      // Hash the password
      let hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      await users.create(name, username, hashedPassword);
      return res.redirect("/login");
    } catch (e) {
      return res.status(500).json("Internal Server Error");
    }
  });

export { loginRouter, signupRouter };