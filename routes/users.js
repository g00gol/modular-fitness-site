import { Router } from "express";
import bcrypt from "bcrypt";

// import { user } from "../data/users.js";
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
    username = username.trim;

    if (!username || !password) {
      return res.render("login", { error: "One or more fields invalid." });
    }

    try {
    } catch (e) {}
  });

/**
 * Signup route
 */
const signupRouter = Router();
signupRouter
  .route("/")
  .get((req, res) => {})
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Hash the password
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        console.log(err);
      } else {
        // Insert the user into the database
        const db = client.db(dbName);
        const collection = db.collection("users");
        collection.insertOne(
          { username: username, password: hash },
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("User added to database");
              req.session.loggedIn = true;
              return res.redirect("/dashboard");
            }
          }
        );
      }
    });
  });

export { loginRouter, signupRouter };
