const formatDuration = (secs) => {
    if(secs<60){return `${secs}s`}
    if(secs<3600)return `${Math.floor(secs/60)}m${secs%60}s`
    return `${Math.floor(secs/3600)}h${secs%3600}m`
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