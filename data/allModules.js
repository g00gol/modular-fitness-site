const allModules = {
  calorieTracker: {
    name: "Calorie Tracker",
  },
  bodyWeightTracker: {
    name: "Body Weight Tracker",
  },
  workoutTracker: {
    name: "Workout Tracker",
  },
  timer: {
    name: "Timer",
  },
  cardioTracker: {
    name: "Cardio Tracker",
  },
  notepad: {
    name: "Notepad",
  },
  eventsCalendar: {
    name: "Events Calendar",
  },
  bloodSugarTracker: {
    name: "Blood Sugar Tracker",
  },
};

const allModulesSorted = allModules.sort((a, b) => {
  if (a.name < b.name) return -1;
  return 1;
});

export default allModulesSorted;
