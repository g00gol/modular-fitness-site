const formatDuration = (s) => {
    let hours = Math.floor(s/3600)
    s = s-(hours*3600)
    let minutes = Math.floor(s/60)
    s = s-(minutes * 60)
    
    minutes = String(minutes)
    s = String(s)
  
    if(minutes.length == 1){minutes = "0"+minutes}
    if(s.length == 1){s = "0"+s}
  
    return `${hours}:${minutes}:${s}`
}

let timer = setInterval(1000000);

const doTimer = (timeLeft) => {
    clearInterval(timer);
    timer = setInterval(function() {
        timeLeft--;
        $('#countdown').html(formatDuration(timeLeft))
        $('#countdown').attr("data-timeLeft", `${timeLeft}`)
        $('#countdown-progress').attr("value", timeLeft)
        if(timeLeft < 0){
            clearInterval(timer);
            $('#countdown').html("Timer Done!")
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    

    $("button.timer-select-button").on("click", function(){
        //this.id has the id for the timer
        toggleTimerMode();
        if($(this).attr("data-title") != $('#timer-name').html()){
            clearInterval(timer);
            $('#timer-counter').attr("data-paused", "false")
            $('#play-pause-p').html("Click to start!")
            $('#timer-name').html($(this).attr("data-title"))
            $('#countdown').html($(this).attr("data-duration"))
            $('#countdown').attr("data-timeLeft", $(this).attr("data-seconds"))
            $('#timer-counter').attr("data-seconds", $(this).attr("data-seconds"))
            $('#countdown-progress').attr("max", $(this).attr("data-seconds"))
            $('#countdown-progress').attr("value", $(this).attr("data-seconds"))
            $("#countdown").show();
            $("#countdown-progress").show();
            $("#play-pause-p").show();
        }
    });
  });



  document.addEventListener("DOMContentLoaded", () => {

    $("#timer-counter").on("click", function(){
        let timeLeft = 0;
        if($(this).attr("data-paused") == 'false'){
            if($('countdown').attr('data-timeLeft')!= ""){
                timeLeft = parseInt($('#countdown').attr("data-timeLeft"))
            }else{
                timeLeft = parseInt($(this).attr("data-seconds"))
            }
            $('#countdown-progress').attr("value", timeLeft)
            doTimer(timeLeft);
            $('#timer-counter').attr("data-paused", "true")
            $('#play-pause-p').html("Click to pause!")
        }else{
            $('#timer-counter').attr("data-paused", "false")
            clearInterval(timer);
            $('#play-pause-p').html("Click to resume!")
        }
    });
  });
  
document.addEventListener("DOMContentLoaded", () => {
    $("#new-timer").on("click", function(){
        console.log("add new timer")
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
function toggleEditTimers() {
    $("#editTimersModal").toggle();
  }
  
  // Validate the workout form
  function validateTimersForm() {
    $("#editTimersForm input").removeClass("invalidInput");
  
    let title = $("#editTimersForm input[name='title']").val();
    let duration_hr = $("#editTimersForm input[name='duration_hr']").val();
    let duration_min = $("#editTimersForm input[name='duration_min']").val();
    let duration_sec = $("#editTimersForm input[name='duration_sec']").val();
  
    
    try {
      paramExists({ title, duration_hr, duration_min, duration_sec});
      return true;
    } catch (e) {
      // Add invalidInput class to the input fields that are missing
      e.forEach((param) => {
        if (param === "title") {
          $("#editTimersForm input[name='title']").addClass(
            "invalidInput"
          );
        }
        if (param === "duration_hr") {
          $("#editTimersForm input[name='duration_hr']").addClass(
            "invalidInput"
          );
        }
        if (param === "duration_min") {
            $("#editTimersForm input[name='duration_min']").addClass(
              "invalidInput"
            );
        }
        if (param === "duration_sec") {
            $("#editTimersForm input[name='duration_sec']").addClass(
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
    if ($("#editTimersBtn").length > 0) {
      $("#editTimersBtn").click(toggleEditTimers);
    }
  
    if ($("#editTimersCancelBtn").length > 0) {
      $("#editTimersCancelBtn").click(toggleEditTimers);
    }
  
  
    if ($("#editTimersForm").length > 0) {
      $("#editTimersForm").submit((e) => {
        e.preventDefault();
        $(".errorContainer").empty();
  
        let valid = true;
        // Validate workout form
        valid &= validateTimersForm();
  

        // If there are any invalid fields, error
        if (!valid) {
          $(".errorContainer").append(
            `<p class="error">One or more fields are invalid</p>`
          );
          return;
        }
  
        // Submit form
        $("#editTimersForm").off("submit").submit();
      });
    }
  });



let stopwatch = setInterval(1000000);

const doStopwatch = () => {
    clearInterval(stopwatch);
    let time = 0
    if($("#stopwatch-counter").attr("data-time") !=""){
      time = parseInt($("#stopwatch-counter").attr("data-time"))
    }
    stopwatch = setInterval(function() {
      time++;
      $("#stopwatch-counter").attr("data-time",time)
      $("#stopwatch-counter").html(formatDuration(time));
        
    }, 1000);
}

  function toggleStopwatchMode(){
    $("#timer-name").html("Stopwatch");
    $("#countdown").hide();
    $("#countdown-progress").hide();
    $("#play-pause-p").hide();
    $("#timer-stopwatch-select").val("Stopwatch").change()
    $("#stopwatch-counter").html("0:00:00")


    $("#stopwatch-counter").attr("data-time","")
    $("#stopwatch-counter").show();
    $("#stopwatch-reset").show();
    $("#stopwatch-pause-play").attr("data-state", "pause");
    $("#stopwatch-pause-play").html("Play");
    $("#stopwatch-pause-play").show();

    return;
    
  }

  function toggleTimerMode(){
    $("#stopwatch-counter").hide();
    clearInterval(stopwatch);
    $("#timer-name").html("Select a Timer!");
    $("#countdown").attr("data-timeLeft", "");
    $("#countdown-progress").attr("value", "");
    $("#countdown-progress").attr("max", "");
    $("#timer-counter").attr("data-paused", "false")
    $("#timer-counter").attr("data-seconds", "")
    $("#stopwatch-pause-play").hide();
    $("#stopwatch-reset").hide();


    $("#timer-stopwatch-select").val("Timer").change();
  }





  document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to edit modules button
    $("#timer-stopwatch-select").on("click", function(){
      if($("#timer-stopwatch-select").val()=="Stopwatch" && $("#timer-name").html()!= "Stopwatch"){
        toggleStopwatchMode();
        return
      }
      if($("#timer-stopwatch-select").val()=="Timer" && $("#timer-name").html()== "Stopwatch"){
        toggleTimerMode();
        return
      }

    });

    $("#stopwatch-pause-play").on("click", function(){
      if($("#stopwatch-pause-play").attr("data-state")=="pause"){
        doStopwatch();
        $("#stopwatch-pause-play").attr("data-state", "play")
        $("#stopwatch-pause-play").html("Pause")
      }else{
        clearInterval(stopwatch);
        $("#stopwatch-pause-play").attr("data-state", "pause")
        $("#stopwatch-pause-play").html("Play")
      }
    })

    $("#stopwatch-reset").on("click", function(){
      clearInterval(stopwatch);
      $("#stopwatch-pause-play").attr("data-state", "pause")
      $("#stopwatch-pause-play").html("Play")
      $("#stopwatch-counter").attr("data-time", "")
      $("#stopwatch-counter").html("0:00:00")

    })


  });