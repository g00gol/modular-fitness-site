// Listen for document load
document.addEventListener("DOMContentLoaded", function () {
  $("#shareCalendarBtn").click(() => {
    $("#shareCalendarModal").toggle();

    // Get the shareable URL
    try {
      $.get({
        url: "/modules/calendar/share",
        success: (data) => {
          // Populate the input with the URL
          $("#shareCalendarInput").val(
            `https://www.google.com/calendar/render?cid=${encodeURIComponent(
              data.url
            )}`
          );
        },
        error: (e) => {
          throw e;
        },
      });
    } catch (e) {
      alert(e);
    }
  });

  $("#shareCalendarCancel").click(() => {
    $("#shareCalendarModal").toggle();
  });
});
