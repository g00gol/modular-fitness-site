/**
 * Routes for user authentication
 */

import { Router } from "express";
import xss from "xss";
import { users } from "../data/index.js";
import * as validation from "../utils/validation.js";
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
      return res.render("/error?500");
    }
  })
  .post(async (req, res) => {
    let { usernameInput, passwordInput } = req.body;
    console.log(usernameInput, passwordInput);
    usernameInput = xss(usernameInput);
    passwordInput = xss(passwordInput);

    try {
      validation.authParam({ usernameInput, passwordInput });
    } catch (e) {
      return res.status(400).render("login", {
        title: "Login",
        invalid: e,
        error: ["One or more fields invalid"],
      });
    }

    /**
     * An array of invalid parameters which is checked later on
     * Each check must be mutually exclusive
     */
    let invalidParams = [];

    try {
      validation.authUsername({ usernameInput });
    } catch (e) {
      invalidParams = [...invalidParams, ...e];
    }

    try {
      validation.authPassword(passwordInput, passwordInput);
    } catch (e) {
      invalidParams = [...invalidParams, ...e];
    }

    if (invalidParams.length > 0) {
      return res.status(400).render("login", {
        title: "Login",
        invalid: invalidParams,
        error: ["Username or password is incorrect"],
      });
    }

    let userData;
    try {
      userData = await users.checkUser(usernameInput, passwordInput);
    } catch (e) {
      // If there was a validation error while logging the user in, render the login page with the invalid parameters
      if (e.invalid) {
        return res.status(400).render("login", {
          title: "Login",
          invalid: e.invalid,
          error: ["Username or password is incorrect"],
        });
      } else if (e.error) {
        return res.status(400).render("login", {
          title: "Login",
          error: e.error,
        });
      } else if (e.serverError) {
        return res.redirect("/error?500");
      } else {
        return res.redirect("/error?500");
      }
    }

    // If the user was successfully logged in, create a session and redirect the user to the modules
    req.session.user = userData;
    console.log(userData);
    return res.redirect("/modules");
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
      return res.redirect("/error?500");
    }
  })
  .post(async (req, res) => {
    let title = "Signup";

    // Get the name, username, password, confirmPassword, DOB from the request body and check if they are valid
    let {
      fullNameInput,
      usernameInput,
      passwordInput,
      confirmPasswordInput,
      DOBInput,
    } = req.body;

    fullNameInput = xss(fullNameInput);
    usernameInput = xss(usernameInput);
    passwordInput = xss(passwordInput);
    confirmPasswordInput = xss(confirmPasswordInput);
    DOBInput = xss(DOBInput);

    try {
      validation.authParam({
        fullNameInput,
        usernameInput,
        passwordInput,
        confirmPasswordInput,
        DOBInput,
      });
    } catch (e) {
      return res.render("signup", {
        title,
        invalid: e,
        error: ["One or more fields invalid"],
      });
    }

    /**
     * An array of invalid parameters which is checked later on
     * Each check must be mutually exclusive
     */
    let invalidParams = [];

    // An object of error messages for each parameter
    const errorMessages = {
      fullNameInput: "Full Name is invalid",
      usernameInput: "Username is invalid",
      passwordInput:
        "Password is invalid. Password must have at least one uppercase character, at least one number, and at least one special character",
      confirmPasswordInput: "Confirm Password is invalid",
      DOBInput: "Date of Birth is invalid or user is under 13 years old",
    };

    try {
      validation.authFullName({ fullNameInput });
    } catch (e) {
      invalidParams = [...invalidParams, ...e];
    }

    try {
      validation.authUsername({ usernameInput });
    } catch (e) {
      invalidParams = [...invalidParams, ...e];
    }

    try {
      validation.authPassword(passwordInput, confirmPasswordInput);
    } catch (e) {
      invalidParams = [...invalidParams, ...e];
    }

    try {
      validation.authDOB({ DOBInput });
    } catch (e) {
      invalidParams = [...invalidParams, ...e];
    }

    // If there are any invalid parameters, render the register page with the invalid parameters
    if (invalidParams.length > 0) {
      // Form the errorMessages array using the errorMessages object and invalidParams array
      let error = [];
      for (const param of invalidParams) {
        error.push(errorMessages[param]);
      }

      // Render the register page with the invalid parameters and error messages
      return res.status(400).render("signup", {
        title,
        invalid: invalidParams,
        error,
      });
    }

    fullNameInput = fullNameInput.trim();
    usernameInput = usernameInput.toLowerCase().trim();

    // Try to add the user to the database
    let userCreated;
    try {
      userCreated = await users.createUser(
        fullNameInput,
        usernameInput,
        passwordInput,
        confirmPasswordInput,
        DOBInput
      );
    } catch (e) {
      if (e.alreadyExists) {
        return res.status(400).render("signup", {
          title,
          invalid: ["usernameInput"],
          error: ["Username already exists"],
        });
      } else if (e.invalid) {
        let error = [];
        for (const param of e.invalid) {
          error.push(errorMessages[param]);
        }

        return res.status(400).render("signup", {
          title,
          invalid: e.invalid,
          error,
        });
      } else if (e.serverError) {
        return res.redirect("/error?500");
      } else {
        return res.redirect("/error?500");
      }
    }

    // Check if the user was successfully created
    if (!userCreated.insertedUser) {
      return res.redirect("/error?500");
    }
    // If the user was successfully created, redirect to the login page
    return res.status(200).redirect("/login");
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
