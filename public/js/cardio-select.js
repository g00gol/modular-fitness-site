document.addEventListener("DOMContentLoaded", () => {

    $("button.cardio-select-button").on("click", function(){
        //this.id has the id for the timer
        $('#cardio-date').html($(this).attr("data-date"));
        $("#cardio-type-distance-duration").html(`${$(this).attr("data-type")} for ${$(this).attr("data-distance")} miles, taking ${$(this).attr("data-duration")} minutes`);
        $('#cardio-pace').html(`Pace: ${Math.floor((parseInt($(this).attr("data-duration"))/parseInt($(this).attr("data-distance")))*10)/10} minutes/mile`);
        $('#cardio-calories-burned').html(`You burned ${$(this).attr("data-calories")} calories!`);


        let dateFormat = `${($(this).attr("data-date")).slice(6)}-${($(this).attr("data-date")).slice(0,2)}-${($(this).attr("data-date")).slice(3,5)}`;
        $("#cardio-data").attr("data-type", $(this).attr("data-type"))
        $("#cardio-data").attr("data-distance", $(this).attr("data-distance"))
        $("#cardio-data").attr("data-duration", $(this).attr("data-duration"))
        $("#cardio-data").attr("data-date", dateFormat)
        $("#cardio-data").attr("data-calories", $(this).attr("data-calories"))
        $("#cardio-data").attr("data-id", $(this).attr("id"))

        $("#updateCardioBtn").show();


    });

    $("#sort-cardio").on("click", function(){
      //console.log($("#sort-cardio").val())
      $('#cardio-heading').html(`${$("#sort-cardio").val()} Cardio Workouts`);
      if($("#sort-cardio").val() != "all"){
        $("button.cardio-select-button").each(function(){
          if ($(this).attr("data-type") != $("#sort-cardio").val()){
            $(this).hide();
          }else{
            $(this).show();
          }
        })
      }else{
        $("button.cardio-select-button").each(function(){
          $(this).show();
        })
      }
    });
});

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



// Toggle the edit modal
function toggleEditCardio() {
    $("#editCardioModal").toggle();
  }
  
  // Validate the workout form
  function validateCardioForm() {
    $("#editCardioForm input").removeClass("invalidInput");
  
    let cardioType = $("#editCardioForm select[name='cardioType']").val();
    let cardioDistance = $("#editCardioForm input[name='distance']").val();
    let cardioDuration = $("#editCardioForm input[name='duration']").val();
    let cardioDate = $("#editCardioForm input[name='date']").val();
    let cardioWeight = $("#editCardioForm input[name='weight']").val();
    let cardioCalories = $("#editCardioForm input[name='calories']").val();

    if(!cardioCalories){cardioCalories = -1}
    if(!cardioWeight){cardioWeight = -1}

    cardioDistance = parseInt(cardioDistance);
    cardioDuration = parseInt(cardioDuration);
    cardioWeight = parseInt(cardioWeight);
    cardioCalories = parseInt(cardioCalories);
  
    // Validate workoutName and workoutDate
    try {
      paramExists({ cardioType, cardioDistance, cardioDuration, cardioDate, cardioWeight, cardioCalories});
      return true;
    } catch (e) {
      // Add invalidInput class to the input fields that are missing
      e.forEach((param) => {
        if (param === "cardioType") {
          $("#editCardioForm input[name='cardioType']").addClass(
            "invalidInput"
          );
        }
        if (param === "cardioDistance") {
          $("#editCardioForm select[name='distance']").addClass(
            "invalidInput"
          );
        }
        if (param === "cardioDuration") {
            $("#editCardioForm select[name='duration']").addClass(
              "invalidInput"
            );
        }
        if (param === "cardioDate") {
            $("#editCardioForm select[name='date']").addClass(
              "invalidInput"
            );
        }
        if (param === "cardioWeight") {
            $("#editCardioForm select[name='weight']").addClass(
              "invalidInput"
            );
        }
        if (param === "cardioCalories") {
            $("#editCardioForm select[name='calories']").addClass(
              "invalidInput"
            );
        }
      });
      return false;
    }
}
  
  
  
  // Wait for document to load
  document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to edit modules button
    // if ($("#editCardioBtn").length > 0) {
    //   $("#editCardioBtn").click(toggleEditCardio);
    // }
    $("#updateCardioBtn").on("click", function(){

      $("#delete-cardio-option").show();
      $("#editCardioForm select[name='type']").val($("#cardio-data").attr("data-type")).change()
      $("#editCardioForm input[name='distance']").attr("value", $("#cardio-data").attr("data-distance"))
      $("#editCardioForm input[name='duration']").attr("value", $("#cardio-data").attr("data-duration"))
      $("#editCardioForm input[name='date']").attr("value" , ($("#cardio-data").attr("data-date")))
      $("#editCardioForm input[name='weight']").attr("value", "")
      $("#editCardioForm input[name='calories']").attr("value", $("#cardio-data").attr("data-calories"))

      $("#editCardioForm").attr("action", `/modules/cardio/${$("#cardio-data").attr("data-id")}`);

      toggleEditCardio();
    })

    if ($("#editCardioBtn").length > 0) {
      $("#editCardioBtn").on("click", function(){
        $("#delete-cardio-option").hide();
        $("#editCardioForm select[name='title']").val("walk").change()
        $("#editCardioForm input[name='distance']").attr("value", "")
        $("#editCardioForm input[name='duration']").attr("value", "")
        $("#editCardioForm input[name='date']").attr("value", "")
        $("#editCardioForm input[name='weight']").attr("value", "")
        $("#editCardioForm input[name='calories']").attr("value", "")
        $("#editCardioForm").attr("action", `/modules/cardio`)

        toggleEditCardio();
      });
    }
  
    if ($("#editCardioCancelBtn").length > 0) {
      $("#editCardioCancelBtn").click(toggleEditCardio);
    }
  
  
    if ($("#editCardioForm").length > 0) {
      $("#editCardioForm").submit((e) => {
        e.preventDefault();
        $(".errorContainer").empty();
  
        let valid = true;
        // Validate workout form
        valid &= validateCardioForm();
  

        // If there are any invalid fields, error
        if (!valid) {
          $(".errorContainer").append(
            `<p class="error">One or more fields are invalid</p>`
          );
          return;
        }
  
        // Submit form
        $("#editCardioForm").off("submit").submit();
      });
    }
  });