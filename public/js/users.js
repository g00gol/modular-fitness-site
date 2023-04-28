import * as validation from "./validation.js";

/**
 * Sets the invalid class for the field
 * @param {*} fieldId
 */
function setInvalidClass(fieldId) {
  $(`#${fieldId}`).addClass("invalidInput");
}

/**
 * Removes the invalid class for the field
 * @param {*} fieldId
 */
function removeInvalidClass(fieldId) {
  $(`#${fieldId}`).removeClass("invalidInput");
}

function signupValidation() {
  $("#signup-form").submit((e) => {
    e.preventDefault();
    $(".errorContainer").empty();

    let fullNameInput = $("#fullNameInput").val().trim();
    let usernameInput = $("#usernameInput").val().trim();
    let passwordInput = $("#passwordInput").val();
    let confirmPasswordInput = $("#confirmPasswordInput").val();
    let DOBInput = $("#DOBInput").val();

    const fieldIds = {
      fullNameInput: "fullNameInput",
      usernameInput: "usernameInput",
      passwordInput: "passwordInput",
      confirmPasswordInput: "confirmPasswordInput",
      DOBInput: "DOBInput",
    };

    Object.values(fieldIds).forEach(removeInvalidClass);

    const errorMessages = {
      fullNameInput: "Full Name is invalid",
      usernameInput: "Username is invalid",
      passwordInput:
        "Password is invalid. Password must have at least one uppercase character, at least one number, and at least one special character",
      confirmPasswordInput: "Confirm Password is invalid",
      DOBInput: "Date of Birth is invalid or user is under 13 years old",
    };

    try {
      validation.authParam({
        fullNameInput,
        usernameInput,
        passwordInput,
        confirmPasswordInput,
        DOBInput,
      });
    } catch (e) {
      for (const param of e) {
        setInvalidClass(fieldIds[param]);
      }
      $(".errorContainer").append(
        `<p class="error">One or more fields are invalid</p>`
      );

      return;
    }

    let invalidParams = [];

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

    if (invalidParams.length > 0) {
      let error = [];
      for (const param of invalidParams) {
        error.push(errorMessages[param]);
        setInvalidClass(fieldIds[param]);
      }
      for (const err of error) {
        $(".errorContainer").append(`<p class="error">${err}</p>`);
      }
    } else {
      $("#signup-form").off("submit").submit();
    }
  });
}

function loginValidation() {
  $("#login-form").submit((e) => {
    e.preventDefault();
    $(".errorContainer").empty();

    let usernameInput = $("#usernameInput").val().trim();
    let passwordInput = $("#passwordInput").val();

    const fieldIds = {
      usernameInput: "usernameInput",
      passwordInput: "passwordInput",
    };

    Object.values(fieldIds).forEach(removeInvalidClass);

    try {
      validation.authParam({ usernameInput, passwordInput });
    } catch (e) {
      for (const param of e) {
        setInvalidClass(fieldIds[param]);
      }
      $(".errorContainer").append(
        `<p class="error">Invalid username or password</p>`
      );

      return;
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
      for (const param of invalidParams) {
        setInvalidClass(fieldIds[param]);
      }
      $(".errorContainer").append(
        `<p class="error">Invalid username or password</p>`
      );
    } else {
      $("#login-form").off("submit").submit();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Check which form is being displayed
  if ($("#signup-form").length > 0) {
    signupValidation();
  } else if ($("#login-form").length > 0) {
    loginValidation();
  }
});
