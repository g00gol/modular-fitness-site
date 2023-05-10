// Listen for document load
document.addEventListener("DOMContentLoaded", function () {
  $("#shareCalendarBtn").click(() => {
    $("#shareCalendarModal").toggle();
  });

  $("#shareCalendarCancel").click(() => {
    $("#shareCalendarModal").toggle();
  });

  // When user clicks, copy the html text
  $("#shareCalendarURL").click(() => {});

  $("#shareCalendarForm").submit(async (e) => {
    e.preventDefault();
    $(".errorContainer").empty();
    $("#shareCalendarURL").hide();

    // Get email
    let shareEmail = $("#shareEmail").val();

    // Validate email
    try {
      if (
        typeof shareEmail === "undefined" ||
        shareEmail === null ||
        // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
        !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          shareEmail
        )
      ) {
        throw ["shareEmail"];
      }
    } catch (e) {
      $(".errorContainer").append(`<p class="error">Invalid email</p>`);
      return;
    }

    // Get the shareable URL
    $.get({
      url: "/modules/calendar/share",
      data: {
        shareEmail,
      },
      success: (data) => {
        // Populate the span with the URL
        $("#shareCalendarURL").show();

        $("#shareCalendarURL").text(
          `https://www.google.com/calendar/render?cid=${encodeURIComponent(
            data.url
          )}`
        );
      },
      error: (jqXHR, x, e) => {
        alert("Error sharing calendar:", e);
      },
    });
  });
});
