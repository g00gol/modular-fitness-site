function paramExists(obj) {
    let invalidParams = [];
    for (let key in obj) {
      if (
        typeof obj[key] === "undefined" ||
        obj[key] === null ||
        obj[key] === ""
      ) {
        invalidParams.push(key);
      }
    }
    if (invalidParams.length > 0) throw invalidParams;
  }


function toggleEditProfile() {
    $("#editProfileModal").toggle();
  }
  
  
  // Wait for document to load before running
  document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to edit modules button
    if ($("#editProfileBtn").length > 0) {
      $("#editProfileBtn").click(toggleEditProfile);
    }
      
  
    if ($("#editProfileCancelBtn").length > 0) {
      $("#editProfileCancelBtn").click(toggleEditProfile);
    }
  });


  function validateProfileForm() {
    $("#editProfileForm input").removeClass("invalidInput");
  
    let fullName = $("#editProfileForm input[name='fullName']").val().trim();
    let bio = $("#editProfileForm textarea[name='bio']").val().trim();


  
    // Validate workoutName and workoutDate
    try {
      paramExists({fullName});
      if(fullName.length > 200){
        $("#editProfileForm input[name='fullName']").addClass("invalidInput");
        return false;
      }
      if(bio.length > 1000){
        $("#editProfileForm textarea[name='bio']").addClass("invalidInput")
        return false;
      }
      return true;
    } catch (e) {
      // Add invalidInput class to the input fields that are missing
      e.forEach((param) => {
        if (param === "fullName") {
          $("#editProfileForm input[name='fullName']").addClass(
            "invalidInput"
          );
        }
      });
      return false;
    }
}
  
  
  document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to edit modules form
    if ($("#editProfileForm").length > 0) {
        $("#editProfileForm").submit((e) => {
            e.preventDefault();
            $(".errorContainer").empty();
    
            let valid = true;
            // Validate workout form
            valid &= validateProfileForm();
    

            // If there are any invalid fields, error
            if (!valid) {
            $(".errorContainer").append(
                `<p class="error">One or more fields are invalid</p>`
            );
            return;
            }
    
            // Submit form
            $("#editProfileForm").off("submit").submit();
        });
    }
  });