document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = $() // add the id of the calendar element

  var calendar = new FullCalendar.Calendar(calendarEl, {
    header: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: "/modules/calendar/events",
    editable: true,
    selectable: true,
  });

  calendar.render();
});
