import * as validation from "../moduleValidation.js";

let workoutId;

function addExerciseFormHTML(ith) {
  return `<div id="addExerciseForm${ith}" class="flex space-x-4 addExerciseForm">
  <button id="removeExerciseBtn${ith}" value="${ith}"><i class="text-xl fa-solid fa-circle-minus"></i></button>

  <label>
    <input name="exerciseSets" type="number" min="1" max="99" />
    sets
  </label>
  <label>
    <input name="exerciseReps" type="number" min="1" max="99" />
    Reps
  </label>
  <label>
    <input name="exerciseName" type="text" maxlength="200" />
    Exercise
  </label>

  <div class="flex">
    <label>
      <input name="exerciseWeight" type="number" step="any" min="1" max="999" />
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
function toggleAddWorkouts() {
  $("#workoutsModal").toggle();

  // Reset the form
  $("#workoutsForm").attr("action", "/modules/workouts");
  $("#workoutsForm input[name='workoutName']").val("");
  $("#workoutsForm select[name='workoutDay']").val("Sunday");

  // Clear errors
  $("#workoutsForm input").removeClass("invalidInput");
  $("#workoutsForm select").removeClass("invalidInput");
  $(".errorContainer").empty();

  // Remove all the existing exercise forms
  $(".addExerciseForm").remove();
}

// Toggle the edit modal
async function toggleEditWorkouts() {
  $("#workoutsModal").toggle();
  $("#workoutsForm").attr("action", `/modules/workouts/${workoutId}`);

  // Clear errors
  $("#workoutsForm input").removeClass("invalidInput");
  $("#workoutsForm select").removeClass("invalidInput");
  $(".errorContainer").empty();

  // Get the workout data
  let workoutData;
  try {
    let res = await axios.get(`/modules/workouts/${workoutId}`, {
      headers: { "X-Client-Side-Request": "true" },
    });
    if (res.data.error) {
      alert(res.data.error);
    }
    workoutData = res.data;
  } catch (e) {
    return;
  }

  // Fill out the form with the existing data
  $("#workoutsForm input[name='workoutName']").val(workoutData.workoutName);
  $("#workoutsForm select[name='workoutDay']").val(workoutData.workoutDay);

  // Remove all the existing exercise forms
  $(".addExerciseForm").remove();

  // Add the exercise forms
  for (let i = 0; i < workoutData.exercises.length; i++) {
    $("#addExerciseBtn").before(addExerciseFormHTML(i));
    $(`#addExerciseForm${i} input[name='exerciseSets']`).val(
      workoutData.exercises[i].exerciseSets
    );
    $(`#addExerciseForm${i} input[name='exerciseReps']`).val(
      workoutData.exercises[i].exerciseReps
    );
    $(`#addExerciseForm${i} input[name='exerciseName']`).val(
      workoutData.exercises[i].exerciseName
    );
    $(`#addExerciseForm${i} input[name='exerciseWeight']`).val(
      workoutData.exercises[i].exerciseWeight
    );
    $(`#addExerciseForm${i} select[name='exerciseWeightUnits']`).val(
      workoutData.exercises[i].exerciseWeightUnits
    );
  }

  // Toggle the delete exercise button
  $("#delete-workout-option").toggle();
}

// Validate the workout form
function validateWorkoutForm() {
  $("#workoutsForm input").removeClass("invalidInput");

  let workoutName = $("#workoutsForm input[name='workoutName']").val();
  let workoutDay = $("#workoutsForm select[name='workoutDay']").val();

  // Validate workoutName and workoutDate
  try {
    validation.paramExists({ workoutName, workoutDay });
  } catch (e) {
    // Add invalidInput class to the input fields that are missing
    e.forEach((param) => {
      if (param === "workoutName") {
        $("#workoutsForm input[name='workoutName']").addClass("invalidInput");
      }
      if (param === "workoutDay") {
        $("#workoutsForm select[name='workoutDay']").addClass("invalidInput");
      }
    });
    return false;
  }

  let invalidParams = [];

  // Validate workoutName
  try {
    validation.paramIsString({ workoutName });
  } catch (e) {
    invalidParams = [...invalidParams, ...e];
  }

  // Validate workoutDay
  if (
    workoutDay !== "Sunday" &&
    workoutDay !== "Monday" &&
    workoutDay !== "Tuesday" &&
    workoutDay !== "Wednesday" &&
    workoutDay !== "Thursday" &&
    workoutDay !== "Friday" &&
    workoutDay !== "Saturday"
  ) {
    invalidParams.push("workoutDay");
  }

  // If there are invalid params, add invalidInput class to the input fields that are invalid
  if (invalidParams.length > 0) {
    invalidParams.forEach((param) => {
      if (param === "workoutName") {
        $("#workoutsForm input[name='workoutName']").addClass("invalidInput");
      }
      if (param === "workoutDay") {
        $("#workoutsForm select[name='workoutDay']").addClass("invalidInput");
      }
    });
    return false;
  }

  return true;
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
    e.forEach((param) => {
      $(`#addExerciseForm${ith} input[name="${param}"]`).addClass(
        "invalidInput"
      );
    });
    return false;
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
    // Add error class to invalid params
    invalidParams.forEach((param) => {
      $(`#addExerciseForm${ith} input[name="${param}"]`).addClass(
        "invalidInput"
      );
    });
    return false;
  }

  return true;
}

// Wait for document to load
document.addEventListener("DOMContentLoaded", async () => {
  if ($("[id^='selectWorkout']").length > 0) {
    const workoutButtons = $("[id^='selectWorkout']");

    workoutButtons.each(function () {
      $(this).click(async function (event) {
        workoutId = event.target.id?.split("?");
        if (!workoutId) return;
        workoutId = workoutId[1];

        // Get workout data based on the workoutId
        let workoutData;
        try {
          let res = await axios.get(`/modules/workouts/${workoutId}`, {
            headers: { "X-Client-Side-Request": "true" },
          });
          if (res.data.error) {
            alert(res.data.error);
          }
          workoutData = res.data;
        } catch (e) {
          return;
        }

        // Helper function to generate the HTML
        function generateExercisesHTML(exercises) {
          return exercises
            .map(
              (exercise) => `
              <div class="exercise">
                <h3>${exercise.exerciseName}</h3>
                <p>Sets: ${exercise.exerciseSets}</p>
                <p>Reps: ${exercise.exerciseReps}</p>
                <p>Weight: ${exercise.exerciseWeight} ${exercise.exerciseWeightUnits}</p>
              </div>
              `
            )
            .join("");
        }

        // Update panel content using the workout data
        const panel2ContentHTML = generateExercisesHTML(workoutData.exercises);

        const exercisesContainer = $("#exercisesContainer");
        exercisesContainer.html(panel2ContentHTML);

        if ($("#editWorkoutsBtn").length > 0) {
          $("#editWorkoutsBtn").show();
        }
      });
    });
  }

  // Add event listener to edit modules button
  if ($("#addWorkoutsBtn").length > 0) {
    $("#addWorkoutsBtn").click(toggleAddWorkouts);
  }

  if ($("#workoutsFormCancelBtn").length > 0) {
    $("#workoutsFormCancelBtn").click(toggleAddWorkouts);
  }

  // Add event listener to edit exercises button
  if ($("#editWorkoutsBtn").length > 0) {
    $("#editWorkoutsBtn").click(async () => {
      await toggleEditWorkouts();
    });
  }

  if ($("#addExerciseBtn").length > 0) {
    $("#addExerciseBtn").click(() => {
      // Get the number of exercise forms with id addExerciseForm${ith}
      let ith = $("div[id^='addExerciseForm']").length;
      // Add the new exercise form
      $("#addExerciseBtn").after(addExerciseFormHTML(ith++));

      $("button[id^='removeExerciseBtn']").click((e) => {
        // Get this button's ith
        let ith = $(e.target.parentNode).val();

        // Remove the ith exercise form
        $(`#addExerciseForm${ith}`).remove();
        return;
      });
    });
  }

  if ($("#workoutsForm").length > 0) {
    $("#workoutsForm").submit((e) => {
      e.preventDefault();
      $(".errorContainer").empty(); 

      let valid = true;
      // Validate workout form
      valid &= validateWorkoutForm();

      // If there are no exercise forms, error
      if ($("div[id^='addExerciseForm']").length > 0) {
        // Get each exercise form
        let exerciseForms = $("div[id^='addExerciseForm']");
        // For each exercise form, validate it
        for (let i = 0; i < exerciseForms.length; i++) {
          valid &= validateExerciseForm(i);
        }
      } else {
        $(".errorContainer").append(
          `<p class="error">You must add at least one exercise</p>`
        );
        return;
      }

      // If there are any invalid fields, error
      if (!valid) {
        $(".errorContainer").append(
          `<p class="error">One or more fields are invalid</p>`
        );
        return;
      }

      // Submit form
      $("#workoutsForm").off("submit").submit();
    });
  }
});
