const allModules = [
  {
    tag: "calorieTracker",
    name: "Calorie Tracker",
  },
  {
    tag: "bodyWeightTracker",
    name: "Body Weight Tracker",
  },
  {
    tag: "workoutTracker",
    name: "Workout Tracker",
  },
  {
    tag: "timer",
    name: "Timer",
  },
  {
    tag: "cardioTracker",
    name: "Cardio Tracker",
  },
  {
    tag: "notepad",
    name: "Notepad",
  },
  {
    tag: "eventsCalendar",
    name: "Events Calendar",
  },
  {
    tag: "bloodSugarTracker",
    name: "Blood Sugar Tracker",
  },
];

// Sort the modules alphabetically
const allModulesSorted = allModules.sort((a, b) =>
  a.name > b.name ? 1 : b.name > a.name ? -1 : 0
);

export default allModulesSorted;
