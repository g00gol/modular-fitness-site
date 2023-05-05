import * as validation from "../workoutTrackerValidation.js";

let noteId;

function validateNoteForm() {
  $("#noteForm input").removeClass("invalidInput");

  let title = $("#noteForm input[name='title']").val();
  let text = $("#noteForm textarea[name='text']").val();

  // Validate workoutName and workoutDate
  try {
    validation.paramExists({ title, text });
  } catch (e) {
    // Add invalidInput class to the input fields that are missing
    e.forEach((param) => {
      if (param === "title") {
        $("#workoutsForm input[name='title']").addClass("invalidInput");
      }
      if (param === "text") {
        $("#workoutsForm textarea[name='text']").addClass("invalidInput");
      }
    });
    return false;
  }

  let invalidParams = [];

  // Validate title
  let validTitle = typeof title === "string" && title.trim().length <= 300;
  if (!validTitle) {
    invalidParams.push("title");
  }
  let validText = typeof text === "string" && text.trim().length <= 25000;
  if (!validText) {
    invalidParams.push("text");
  }

  // If there are invalid params, add invalidInput class to the input fields that are invalid
  if (invalidParams.length > 0) {
    invalidParams.forEach((param) => {
      if (param === "title") {
        $("#workoutsForm input[name='title']").addClass("invalidInput");
      }
      if (param === "text") {
        $("#workoutsForm textarea[name='text']").addClass("invalidInput");
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

// Toggle the edit modal
function toggleAddNote() {
  $("#noteModal").toggle();

  // Reset the form
  $("#noteForm").attr("action", "/modules/notes");
}

// Toggle the edit modal
async function toggleEditNotes() {
  $("#noteModal").toggle();
  $("#noteForm").attr("action", `/modules/notes/${noteId}`);

  // Get the calorie data
  let noteData;
  try {
    let res = await axios.get(`/modules/notes/${noteId}`, {
      headers: { "X-Client-Side-Request": "true" },
    });
    if (res.data.error) {
      alert(res.data.error);
    }
    noteData = res.data;
  } catch (e) {
    console.log(e);
    return;
  }

  // Fill out the form with the existing data
  $("#noteForm input[name='title']").val(noteData.title);
  $("#noteForm textarea[name='text']").val(noteData.text);
}

// Wait for document to load
document.addEventListener("DOMContentLoaded", async () => {
  if ($("[id^='selectNote']").length > 0) {
    const noteEntryButtons = $("[id^='selectNote']");

    noteEntryButtons.each(function () {
      $(this).click(async function (event) {
        let noteId = event.target.id?.split("?");
        if (!noteId) return;
        noteId = noteId[1];

        await toggleEditNotes();
      });
    });
  }

  // Add event listener to add calorie entry button
  if ($("#addNoteBtn").length > 0) {
    $("#addNoteBtn").click(toggleAddNote);
  }

  if ($("#noteFormCancelBtn").length > 0) {
    $("#noteFormCancelBtn").click(toggleAddNote);
  }

  if ($("#noteForm").length > 0) {
    $("#noteForm").submit((e) => {
      e.preventDefault();
      $(".errorContainer").empty();

      let valid = true;

      // Validate note form
      valid &= validateNoteForm();

      // If there are any invalid fields, error
      if (!valid) {
        $(".errorContainer").append(
          `<p class="error">One or more fields are invalid</p>`
        );
        return;
      }

      // Submit form
      $("#calorieForm").off("submit").submit();
    });
  }
});
