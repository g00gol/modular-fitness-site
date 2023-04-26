//JQuery here
import * as validation from "./clientSideHelper.js";

//signup form's id = registration-form
// username input's id = usernameInput
//password input's id = passwordInput
// retyed password's id = retypePasswordInput
function registrationValidation() {
  $("#registration-form").submit((e) => {
    e.preventDefault();
    $(".errorContainer").empty();

    let {
      firstNameInput,
      lastNameInput,
      emailAddressInput,
      passwordInput,
      confirmPasswordInput,
      roleInput,
    } = e.target;

    // An object of error messages for each parameter
    const errorMessages = {
      firstNameInput: "First Name is invalid",
      lastNameInput: "Last Name is invalid",
      emailAddressInput: "Email Address is invalid",
      passwordInput:
        "Password is invalid. Password must have at least one uppercase character, at least one number, and at least one special character",
      confirmPasswordInput: "Confirm Password is invalid",
      roleInput: "Role is invalid",
    };

    try {
      validation.authParam({
        firstNameInput: firstNameInput.value,
        lastNameInput: lastNameInput.value,
        emailAddressInput: emailAddressInput.value,
        passwordInput: passwordInput.value,
        confirmPasswordInput: confirmPasswordInput.value,
      });
    } catch (e) {
      let error = [];
      // For each invalid parameter, map a new error message to the errorMessages array
      for (const param of e) {
        error.push(errorMessages[param]);
      }
      // Then, display the error messages
      for (const err of error) {
        $(".errorContainer").append(`<p class="error">${err}</p>`);
      }

      return;
    }

    /**
     * An array of invalid parameters which is checked later on
     * Each check must be mutually exclusive
     */
    let invalidParams = [];
    // Validate firstNameInput and lastNameInput
    try {
      validation.authName({
        firstNameInput: firstNameInput.value,
        lastNameInput: lastNameInput.value,
      });
    } catch (e) {
      // Add the invalid parameters array to the invalidParams array
      invalidParams = [...invalidParams, ...e];
    }

    // Validate emailAddressInput
    try {
      validation.authEmail({ emailAddressInput: emailAddressInput.value });
    } catch (e) {
      // Add the invalid parameters array to the invalidParams array
      invalidParams = [...invalidParams, ...e];
    }

    // Validate passwordInput and confirmPasswordInput
    try {
      validation.authPassword(passwordInput.value, confirmPasswordInput.value);
    } catch (e) {
      // Add the invalid parameters array to the invalidParams array
      invalidParams = [...invalidParams, ...e];
    }

    // Validate roleInput
    if (
      !roleInput.value ||
      !["admin", "user"].includes(roleInput.value.toLowerCase())
    ) {
      invalidParams.push("roleInput");
    }

    // Check if there are any invalid parameters
    if (invalidParams.length > 0) {
      let error = [];
      // For each invalid parameter, map a new error message to the errorMessages array
      for (const param of invalidParams) {
        error.push(errorMessages[param]);
      }
      // Then, display the error messages
      for (const err of error) {
        $(".errorContainer").append(`<p class="error">${err}</p>`);
      }
    } else {
      $("#registration-form").off("submit").submit();
    }
  });
}

//login form's id = login-form
//login form username input's id = userNameInput
// login form password input's id = passwordInput
function loginValidation() {
  $("#login-form").submit((e) => {
    e.preventDefault();
    $(".errorContainer").empty();

    let { emailAddressInput, passwordInput } = e.target;

    // An object of error messages for each parameter
    const errorMessages = {
      emailAddressInput: "Email Address is invalid",
      passwordInput: "Password is invalid",
    };

    try {
      validation.authParam({
        emailAddressInput: emailAddressInput.value,
        passwordInput: passwordInput.value,
      });
    } catch (e) {
      let error = [];
      // For each invalid parameter, map a new error message to the errorMessages array
      for (const param of e) {
        error.push(errorMessages[param]);
      }
      // Then, display the error messages
      for (const err of error) {
        $(".errorContainer").append(`<p class="error">${err}</p>`);
      }

      return;
    }

    /**
     * An array of invalid parameters which is checked later on
     * Each check must be mutually exclusive
     */
    let invalidParams = [];

    // Validate emailAddressInput
    try {
      validation.authEmail({ emailAddressInput: emailAddressInput.value });
    } catch (e) {
      // Add the invalid parameters array to the invalidParams array
      invalidParams = [...invalidParams, ...e];
    }

    // Validate passwordInput
    try {
      validation.authPassword(passwordInput.value, passwordInput.value);
    } catch (e) {
      // Add the invalid parameters array to the invalidParams array
      invalidParams = [...invalidParams, ...e];
    }

    // Check if there are any invalid parameters
    if (invalidParams.length > 0) {
      let error = [];
      // For each invalid parameter, map a new error message to the errorMessages array
      for (const param of invalidParams) {
        error.push(errorMessages[param]);
      }
      // Then, display the error messages
      for (const err of error) {
        $(".errorContainer").append(`<p class="error">${err}</p>`);
      }
    } else {
      $("#login-form").off("submit").submit();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Check which form is being displayed
  if ($("#registration-form").length > 0) {
    registrationValidation();
  } else if ($("#login-form").length > 0) {
    loginValidation();
  }
});
