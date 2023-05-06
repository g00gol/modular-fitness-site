document.addEventListener("DOMContentLoaded", async function () {
  let calendarEl = document.querySelector("[id^='calendar']");
  if (!calendarEl) return;

  let calendarId = calendarEl.id.split("?")[1];
  console.log(calendarId);

  let events;
  try {
    events = await axios.get("/modules/calendar/events");
  } catch (e) {
    alert("Error fetching events");
  }

  console.log(events.data.events);

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
    select: function (info) {
      var title = prompt("Please enter a new event title:");
      var eventData;

      if (title) {
        eventData = {
          title: title,
          start: info.startStr,
          end: info.endStr,
        };

        // Send the new event to the server
        fetch(`/modules/calendar/add-event?calendarId=${calendarId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        })
          .then((response) => {
            if (response.ok) {
              calendar.addEvent(eventData); // Add the event to the calendar
            } else {
              alert("Error adding event");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Error adding event");
          });
      }
      calendar.unselect();
    },
  });

  calendar.render();
});
