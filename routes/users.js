/**
 * Routes for user authentication
 */

import { Router } from "express";
import bcrypt from "bcrypt";
import xss from "xss";
import moment from "moment";
import { users } from "../data/index.js";
import * as validation from "../utils/helpers.js";
import * as middleware from "../utils/middleware.js";

/**
 * Login route
 */
const loginRouter = Router();
loginRouter
  .route("/")
  .get(middleware.login, (req, res) => {
    let title = "Login";

    try {
      return res.render("login", { title });
    } catch (e) {
      return res.status(500).json("Internal Server Error");
    }
  })
  .post(async (req, res) => {
    let title = "Login";
    // Get the username and password from the request body and check if they are valid
    let { username, password } = req.body;
    username = xss(username);
    password = xss(password);
    if (!username || !password) {
      return res.render("login", {
        title,
        error: "One or more fields invalid.",
      });
    }

    // Trim the username
    username = username.trim();

    // Check if the username exists in the database
    try {
      var user = await users.getByUsername(username);
    } catch (e) {
      return res.render("login", {
        title,
        error: "Invalid username or password.",
      });
    }

    // Check if the password is correct
    let auth = await bcrypt.compare(password, user.password);

    // If the password is correct, set the session and redirect to dashboard
    if (auth) {
      // Set the session
      req.session.username = username
      req.session.user = user.name;
      req.session.loggedIn = true;

      return res.redirect("/");
    } else {
      res.render("login", {
        title,
        error: "Invalid username or password.",
      });
    }
  });

/**
 * Signup route
 */
const signupRouter = Router();
signupRouter
  .route("/")
  .get(middleware.signup, (req, res) => {
    let title = "Signup";

    try {
      return res.render("signup", { title });
    } catch (e) {
      return res.status(500).json("Internal Server Error");
    }
  })
  .post(async (req, res) => {
    let title = "Signup";

    // Get the name, username, password and retypePassword from the request body and check if they are valid
    let { name, username, password, retypePassword, DOB } = req.body;
    // console.log(req.body)
    name = xss(name);
    username = xss(username);
    password = xss(password);
    DOB = xss(DOB);
    retypePassword = xss(retypePassword);
    
    if (!name || !username || !password || !retypePassword || !DOB) {
      return res.render("signup", {
        title,
        name,
        username,
        error: "One or more fields invalid.",
      });
    }
  
  //https://stackoverflow.com/questions/14057497/moment-js-how-do-i-get-the-number-of-years-since-a-date-not-rounded-up
  //checking if the date is from the future
    if(moment(DOB).isAfter(moment()))
    {
      return res.render("signup", 
      {
        title,
        name,
        username,
        error: "Date of birth can not be from the future.",
      });
    }
    //checking if the user is under 13
    let age =  moment().diff(DOB, 'years'); 
    if(age < 13)
    {
      return res.render("signup", 
      {
        title,
        name,
        username,
        error: "Sorry, User must be at least 13 years old.",
      });
    }
    
    // Trim the name and username
    name = name.trim();
    username = username.trim();

    //making name and username lower case
    username = username.toLowerCase()

    // Check if the passwords match
    if (password !== retypePassword) {
      return res.render("signup", {
        title,
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

/**
 * Logout route
 */
const logoutRouter = Router();
logoutRouter.route("/").get(middleware.logout, (req, res) => {
  try {
    req.session.destroy();
  } catch (e) {
    return res.redirect("/error?500");
  }

  return res.redirect("/");
});

export { loginRouter, signupRouter, logoutRouter };
