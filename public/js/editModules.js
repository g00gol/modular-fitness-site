import allModules from "../allModules.js";

function toggleEditModules() {
  $("#editModulesModal").toggle();
}

function validateModuleInputs() {
  $("#editModulesForm").submit((e) => {
    let checkboxes = $("#editModulesForm input[type='checkbox']");

    // Make sure the checked values match one of the allModules
    let match = true;
    for (let checkbox of checkboxes) {
      if (checkbox.checked) {
        if (!allModules.find((module) => module.tag === checkbox.value)) {
          match = false;
          break;
        }
      }
    }

    if (!match) {
      e.preventDefault();
      return alert("Invalid input");
    }

    $("#editModulesForm").off("submit").submit();
  });
}

// Wait for document to load before running
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to edit modules button
  if ($("#editModulesBtn").length > 0) {
    $("#editModulesBtn").click(toggleEditModules);
  }

  // Add event listener to edit modules form
  if ($("#editModulesForm").length > 0) {
    validateModuleInputs();
  }

  if ($("#editModulesCancelBtn").length > 0) {
    $("#editModulesCancelBtn").click(toggleEditModules);
  }
});
