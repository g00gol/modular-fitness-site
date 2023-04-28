function toggleEditModules() {
  console.log("edit modules button clicked");
  $("#editModulesModal").toggle();
}

// Wait for document to load before running
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to edit modules button
  $("#editModulesBtn").on("click", toggleEditModules);
});

document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to edit modules button
  $("#saved-timers").on("click", console.log(this.id));
});