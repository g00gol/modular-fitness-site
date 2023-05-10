import * as validation from "./moduleValidation.js";

// Toggles the modal for adding a new event
async function addEvent() {
  $("#eventsModal").toggle();

  // Listen for the submit event on the form
  $("#eventsForm").submit((e) => {
    e.preventDefault();
    $(".errorContainer").empty();

    // Get the form data
    let eventName = $("#eventsForm input[name='eventName']").val();
    let eventDate = $("#eventsForm input[name='eventDate']").val();
    let eventStartTime = $("#eventsForm input[name='eventStartTime']").val();
    let eventEndTime = $("#eventsForm input[name='eventEndTime']").val();
    let eventDescription = $(
      "#eventsForm textarea[name='eventDescription']"
    ).val();

    // Validate the form data
    try {
      validation.paramExists({
        eventName,
        eventDate,
        eventStartTime,
        eventEndTime,
      });
      validation.paramIsString({
        eventName,
        eventDate,
        eventStartTime,
        eventEndTime,
      });
    } catch (e) {
      $(".errorContainer").append(
        `<p class="error">One or more fields are invalid</p>`
      );
      return;
    }

    // Check if eventDate is a valid date
    try {
      validation.paramIsDate({
        eventDate,
      });
    } catch (e) {
      $(".errorContainer").append(`<p class="error">Invalid date format</p>`);
      return;
    }

    // Check if eventStartTime is before eventEndTime
    let eventStartTimeDate = new Date(`01/01/2000 ${eventStartTime}`);
    let eventEndTimeDate = new Date(`01/01/2000 ${eventEndTime}`);
    if (eventStartTimeDate > eventEndTimeDate) {
      $(".errorContainer").append(
        `<p class="error">Event start time must be before event end time</p>`
      );
      return;
    }

    if (eventDescription.trim().length > 0) {
      try {
        validation.paramIsString({
          eventDescription,
        });
      } catch (e) {
        $(".errorContainer").append(
          `<p class="error">One or more fields are invalid</p>`
        );
        return;
      }
    }

    // Validate time format
    let timeRegex = /([01][0-9]|[02][0-3]):[0-5][0-9]/;
    if (!timeRegex.test(eventStartTime) || !timeRegex.test(eventEndTime)) {
      $(".errorContainer").append(`<p class="error">Invalid time format</p>`);
      return;
    }

    // Everything looks good, submit the form
    $("#eventsForm").off("submit").submit();
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  let calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  let events;
  try {
    events = await axios.get("/modules/calendar/events", {
      headers: {
        "X-Client-Side-Request": "true",
      },
    });
  } catch (e) {
    alert("Error fetching events");
  }

  let calendar = new FullCalendar.Calendar(calendarEl, {
    events: events.data.events,
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    editable: true,
    selectable: true,
    select: addEvent,
  });

  calendar.render();
});

document.addEventListener("DOMContentLoaded", function () {
  // Listen for cancel button click
  $("#eventsFormCancel").click(() => {
    $("#eventsModal").toggle();
  });
});
