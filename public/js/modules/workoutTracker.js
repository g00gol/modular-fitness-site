import * as validation from "../workoutTrackerValidation.js";

function addExerciseFormHTML(ith) {
  return `<div id="addExerciseForm${ith}" class="addExerciseForm">
  <button id="removeExerciseBtn${ith}"><i class="text-xl fa-solid fa-circle-minus"></i></button>

  <label>
    <input name="exerciseSets" type="number" />
    sets
  </label>
  <label>
    <input name="exerciseReps" type="number" />
    Reps
  </label>
  <label>
    <input name="exerciseName" type="text" />
    Exercise
  </label>

  <div class="flex">
    <label>
      <input name="exerciseWeight" type="number" step="0.1" />
    </label>
    <select name="exerciseWeightUnits">
      <option value="lbs">
        lbs
      </option>
      <option value="kg">
        kg
      </option>
    </select>
  </div>
</div>`;
}

// Toggle the edit modal
function toggleEditWorkouts() {
  $("#editWorkoutsModal").toggle();
}

// Validate Exercise Form
/**
 * Validatese the ith exercise form
 * @param {number} ith The ith exercise form
 */
function validateExerciseForm(ith) {
  let exerciseSets = $(
    `#addExerciseForm${ith} input[name="exerciseSets"]`
  ).val();
  let exerciseReps = $(
    `#addExerciseForm${ith} input[name="exerciseReps"]`
  ).val();
  let exerciseName = $(
    `#addExerciseForm${ith} input[name="exerciseName"]`
  ).val();
  let exerciseWeight = $(
    `#addExerciseForm${ith} input[name="exerciseWeight"]`
  ).val();
  let exerciseWeightUnits = $(
    `#addExerciseForm${ith} select[name="exerciseWeightUnits"]`
  ).val();

  // Reset invalidInput class
  $(`#addExerciseForm${ith} input`).removeClass("invalidInput");

  let invalidParams = [];
  // Check if all params exist
  try {
    validation.paramExists({
      exerciseSets,
      exerciseReps,
      exerciseName,
      exerciseWeight,
      exerciseWeightUnits,
    });
  } catch (e) {
    invalidParams = [...invalidParams, ...e];
  }

  // Validate exerciseName and exerciseWeightUnits
  try {
    validation.paramIsString({
      exerciseName,
      exerciseWeightUnits,
    });

    if (exerciseWeightUnits !== "lbs" && exerciseWeightUnits !== "kg") {
      invalidParams.push("exerciseWeightUnits");
    }
  } catch (e) {
    invalidParams = [...invalidParams, ...e];
  }

  // Validate exerciseSets, exerciseReps, and exerciseWeight
  try {
    validation.paramIsNum({
      exerciseSets,
      exerciseReps,
      exerciseWeight,
    });

    /**
     * Further validation for the specific fields
     */
    exerciseSets = Number(exerciseSets);
    exerciseReps = Number(exerciseReps);
    exerciseWeight = Number(exerciseWeight);
    let invalidParams = [];

    // Check if exercise sets is a positive integer between 1 and 99
    if (
      !Number.isInteger(exerciseSets) ||
      exerciseSets < 1 ||
      exerciseSets > 99
    ) {
      invalidParams.push("exerciseSets");
    }

    // Check if exercise reps is a positive integer between 1 and 99
    if (
      !Number.isInteger(exerciseReps) ||
      exerciseReps < 1 ||
      exerciseReps > 99
    ) {
      invalidParams.push("exerciseReps");
    }

    // Check if exercise weight is a positive number between 0 and 9999
    if (isNaN(exerciseWeight) || exerciseWeight <= 0 || exerciseWeight > 9999) {
      invalidParams.push("exerciseWeight");
    }

    if (invalidParams.length > 0) throw invalidParams;
  } catch (e) {
    invalidParams = [...invalidParams, ...e];
  }

  if (invalidParams.length > 0) {
    console.log(invalidParams);
    // Add error class to invalid params
    invalidParams.forEach((param) => {
      $(`#addExerciseForm${ith} input[name="${param}"]`).addClass("invalidInput");
    });
    return;
  }

  $("#addExerciseForm").remove();
}

// Wait for document to load
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to edit modules button
  if ($("#editWorkoutsBtn").length > 0) {
    $("#editWorkoutsBtn").click(toggleEditWorkouts);
  }

  if ($("#editWorkoutsCancelBtn").length > 0) {
    $("#editWorkoutsCancelBtn").click(toggleEditWorkouts);
  }

  if ($("#addExerciseBtn").length > 0) {
    $("#addExerciseBtn").click(() => {
      // Get the number of exercise forms with id addExerciseForm${ith}
      let ith = $("div[id^='addExerciseForm']").length;
      // Add the new exercise form
      $("#addExerciseBtn").after(addExerciseFormHTML(ith++));
    });
  }

  if ($("#editWorkoutsForm").length > 0) {
    $("#editWorkoutsForm").submit((e) => {
      e.preventDefault();

      console.log("submitting");
      if ($("div[id^='addExerciseForm']").length > 0) {
        // Get each exercise form
        let exerciseForms = $("div[id^='addExerciseForm']");
        // For each exercise form, validate it
        for (let i = 0; i < exerciseForms.length; i++) {
          validateExerciseForm(i);
        }
      }

      if (false) {
        $("#editWorkoutsForm").off("submit").submit();
      } else {
        return;
      }
    });
  }
});
