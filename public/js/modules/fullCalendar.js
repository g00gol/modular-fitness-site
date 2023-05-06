document.addEventListener("DOMContentLoaded", function () {
  let calendarEl = $("[id^='calendar']");
  // split the id to get the calendarId
  let calendarId = calendarEl.attr("id").split("?")[1];

  let calendar = new FullCalendar.Calendar(calendarEl, {
    header: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: `/modules/calendar/events?calendarId=${calendarId}`,
    editable: true,
    selectable: true,
  });

  calendar.render();
});
