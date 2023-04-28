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
      return res.render("login", { title, disableNav: true });
    } catch (e) {
      return res.render("/error?500");
    }
  })
  .post(async (req, res) => {
    let { usernameInput, passwordInput } = req.body;
    usernameInput = xss(usernameInput);
    passwordInput = xss(passwordInput);

    let persistedFields = ["usernameInput"];

    try {
      validation.authParam({ usernameInput, passwordInput });
    } catch (e) {
      // Make an object of the valid inputs by comparing it with which inputs were invalid using e {fullNameInput: "value", usernameInput: "value", ...}
      let validParams = persistedFields.reduce((acc, field) => {
        // Check if the field exists in the error array
        if (!e.includes(field)) {
          // If not, add it to the validParams object
          acc[field] = req.body[field];
        }
        return acc;
      }, {});

      return res.status(400).render("login", {
        title: "Login",
        valid: validParams,
        invalid: e,
        error: ["Invalid username or password"],
        disableNav: true,
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
      // Make an object of the valid inputs by comparing it with which inputs were invalid and their values {fullNameInput: "value", usernameInput: "value", ...}
      let validParams = persistedFields.reduce((acc, field) => {
        // Check if the field exists in the error array
        if (!invalidParams.includes(field)) {
          // If not, add it to the validParams object
          acc[field] = req.body[field];
        }
        return acc;
      }, {});

      return res.status(400).render("login", {
        title: "Login",
        valid: validParams,
        invalid: ["usernameInput", "passwordInput"],
        error: ["Username or password is incorrect"],
        disableNav: true,
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
          valid: { usernameInput },
          invalid: ["usernameInput", "passwordInput"],
          error: ["Username or password is incorrect"],
          disableNav: true,
        });
      } else if (e.error) {
        return res.status(400).render("login", {
          title: "Login",
          valid: { usernameInput },
          invalid: ["usernameInput", "passwordInput"],
          error: e.error,
          disableNav: true,
        });
      } else if (e.serverError) {
        return res.redirect("/error?500");
      } else {
        return res.redirect("/error?500");
      }
    }

    // If the user was successfully logged in, create a session and redirect the user to the modules
    req.session.user = userData;
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
      return res.render("signup", { title, disableNav: true });
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

    let persistedFields = ["fullNameInput", "usernameInput", "DOBInput"];

    try {
      validation.authParam({
        fullNameInput,
        usernameInput,
        passwordInput,
        confirmPasswordInput,
        DOBInput,
      });
    } catch (e) {
      // Make an object of the valid inputs by comparing it with which inputs were invalid and their values {fullNameInput: "value", usernameInput: "value", ...}
      let validParams = persistedFields.reduce((acc, field) => {
        if (!e.includes(field)) {
          acc[field] = req.body[field];
        }
        return acc;
      }, {});

      return res.render("signup", {
        title,
        valid: validParams,
        invalid: e,
        error: ["One or more fields are invalid"],
        disableNav: true,
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
      // For each invalid parameter, map a new error message to the errorMessages array
      let error = [];
      for (const param of invalidParams) {
        error.push(errorMessages[param]);
      }

      // Make an object of the valid inputs by comparing it with which inputs were invalid and their values {fullNameInput: "value", usernameInput: "value", ...}
      let validParams = persistedFields.reduce((acc, field) => {
        if (!invalidParams.includes(field)) {
          acc[field] = req.body[field];
        }
        return acc;
      }, {});

      // Render the register page with the invalid parameters and error messages
      return res.status(400).render("signup", {
        title,
        valid: validParams,
        invalid: invalidParams,
        error,
        disableNav: true,
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
          valid: { fullNameInput, DOBInput },
          invalid: ["usernameInput"],
          error: ["Username already exists"],
          disableNav: true,
        });
      } else if (e.invalid) {
        let error = [];
        for (const param of e.invalid) {
          error.push(errorMessages[param]);
        }

        // Make an object of the valid inputs by comparing it with which inputs were invalid and their values {fullNameInput: "value", usernameInput: "value", ...}
        let validParams = persistedFields.reduce((acc, field) => {
          if (!e.invalid.includes(field)) {
            acc[field] = req.body[field];
          }
          return acc;
        }, {});

        return res.status(400).render("signup", {
          title,
          valid: validParams,
          invalid: e.invalid,
          error,
          disableNav: true,
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
