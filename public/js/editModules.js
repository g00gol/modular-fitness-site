import allModules from "../constants/allModules.js";

function toggleEditModules() {
  $("#modulesFileInput").val("");
  $(".errorContainer").empty();
  $(`#modulesFileInput`).removeClass("invalidInput");
  $("#editModulesModal").toggle();
}

function init() {
  $(".unenabled, .enabled")
    .sortable({
      connectWith: ".connected-sortable",
      stack: ".connected-sortable ul",
    })
    .disableSelection();
}

function checkImportedModules(modulesString) {
  if (!modulesString || typeof modulesString !== "string") {
    $(".errorContainer").append(`<p class="error">Invalid import file.</p>`);
    $(`#modulesFileInput`).addClass("invalidInput");

    return;
  }
  let validTags = allModules.map((mod) => mod.tag);
  let enabledModules = modulesString.trim().split(/\s+/);

  let checkDuplicates = (arr) => {
    let isDuplicate = (elem, ind) => {
      let index = arr.indexOf(elem);
      return index !== ind;
    };
    let length = arr.filter(isDuplicate).length;
    return length > 0;
  };

  if (checkDuplicates(enabledModules)) {
    $(".errorContainer").append(`<p class="error">Invalid import file.</p>`);
    $(`#modulesFileInput`).addClass("invalidInput");
    return;
  }

  for (const module of enabledModules) {
    if (!validTags.includes(module)) {
      $(".errorContainer").append(`<p class="error">Invalid import file.</p>`);
      $(`#modulesFileInput`).addClass("invalidInput");
      return;
    }
  }

  return enabledModules;
}

$(init);

// Wait for document to load before running
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to edit modules button
  if ($("#editModulesBtn").length > 0) {
    $("#editModulesBtn").click(toggleEditModules);
  }

  if ($("#editModulesCancelBtn").length > 0) {
    $("#editModulesCancelBtn").click(toggleEditModules);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to edit modules form
  $("#submit-edit-modules").on("click", function () {
    let enabledModules = [];
    $("#enabled-modules li").each(function () {
      enabledModules.push($(this).attr("data-tag"));
    });
    $.post(
      "/modules",
      { modules: enabledModules },
      () => (window.location.href = "/modules")
    ).fail(function () {
      window.location.href = "/error?status=500";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Implement export modules "button" (anchor styled as a button)

  $.get("/modules/enabled", (data) => {
    const blob = new Blob([data], {
      type: "text/plain",
    });
    const link = window.URL.createObjectURL(blob);
    $("#exportModulesBtn").attr("href", link).attr("download", "modules.txt");
  }).fail(function () {
    window.location.href = "/error?status=500";
  });

  // Implement import modules button
  $("#importExportForm").submit((e) => {
    e.preventDefault();
    let file = $("#modulesFileInput").prop("files")[0];
    if (!file) {
      $(".errorContainer").append(`<p class="error">No file provided</p>`);
      $(`#modulesFileInput`).addClass("invalidInput");
    } else if (file.size > 5000) {
      $(".errorContainer").append(`<p class="error">File too large</p>`);
      $(`#modulesFileInput`).addClass("invalidInput");
    } else {
      $(".errorContainer").empty();
      $(`#modulesFileInput`).removeClass("invalidInput");
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        let result = reader.result;
        let enabledModules = checkImportedModules(result);
        if (enabledModules) {
          $.post(
            "/modules",
            { modules: enabledModules },
            () => (window.location.href = "/modules")
          ).fail(function () {
            window.location.href = "/error?status=500";
          });
        }
      });
      reader.readAsText(file);
    }
  });
});
