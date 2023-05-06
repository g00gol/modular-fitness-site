let noteId;

function validateNoteForm() {
  $("#noteForm input").removeClass("invalidInput");
  $("#noteForm textarea").removeClass("invalidInput");

  let title = $("#noteForm input[name='title']").val();
  let text = $("#noteForm textarea[name='text']").val();

  // Validate title and text
  let invalidParams = [];

  if (!text) {
    text = "";
  } else if (typeof text !== "string") {
    invalidParams.push("text");
  } else if (typeof title !== "string") {
    invalidParams.push("title");
  } else if (title.length > 300) {
    invalidParams.push("title");
  } else if (text.length > 25000) {
    invalidParams.push("text");
  }

  if ((!title || title.trim().length === 0) && text.length === 0) {
    invalidParams.push("title");
    invalidParams.push("text");
  }

  // If there are invalid params, add invalidInput class to the input fields that are invalid
  if (invalidParams.length > 0) {
    invalidParams.forEach((param) => {
      if (param === "title") {
        $("#noteForm input[name='title']").addClass("invalidInput");
      }
      if (param === "text") {
        $("#noteForm textarea[name='text']").addClass("invalidInput");
      }
    });
    return false;
  }

  return true;
}

// Toggle the edit modal
function toggleAddNote() {
  $("#noteModal").toggle();

  // reset errors
  $(".errorContainer").empty();
  $("#noteForm input").removeClass("invalidInput");
  $("#noteForm textarea").removeClass("invalidInput");

  // Reset the form
  $("#noteForm").attr("action", "/modules/notes");
}

// Toggle the edit modal
async function toggleEditNotes() {
  $("#noteModal").toggle();
  $("#noteForm").attr("action", `/modules/notes/${noteId}`);

  // reset errors
  $(".errorContainer").empty();
  $("#noteForm input").removeClass("invalidInput");
  $("#noteForm textarea").removeClass("invalidInput");

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
  $("#noteForm textarea[name='text']").focus().val(noteData.text);
}

// Wait for document to load
document.addEventListener("DOMContentLoaded", async () => {
  if ($("[id^='selectNote']").length > 0) {
    const noteEntryButtons = $("[id^='selectNote']");

    noteEntryButtons.each(function () {
      $(this).click(async function (event) {
        noteId = event.target.id?.split("?");
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
      $("#noteForm").off("submit").submit();
    });
  }
});
