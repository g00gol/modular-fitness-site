import allModules from "../constants/allModules.js";

function toggleEditModules() {
  $("#editModulesModal").toggle();
}



function init() {
  $( ".unenabled, .enabled" ).sortable({
      connectWith: ".connected-sortable",
      stack: '.connected-sortable ul'
    }).disableSelection();
}

$( init );


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
  $("#submit-edit-modules").on("click", function(){
    let enabledModules = []
    $("#enabled-modules li").each(function(){
      enabledModules.push($(this).attr("tag"))
    })
    return $.post("/modules", {modules: enabledModules}, function(){
      return window.location.href = "/modules"
    })
  })
});