document.addEventListener("DOMContentLoaded", () => {

    $("button.cardio-select-button").on("click", function(){
        //this.id has the id for the timer
        $('#cardio-date').html($(this).attr("data-date"));
        $("#cardio-type-distance-duration").html(`${$(this).attr("data-type")} for ${$(this).attr("data-distance")} miles, taking ${$(this).attr("data-duration")} minutes`);
        $('#cardio-pace').html(`Pace: ${Math.floor((parseInt($(this).attr("data-duration"))/parseInt($(this).attr("data-distance")))*10)/10} minutes/mile`);
        $('#cardio-calories-burned').html(`You burned ${$(this).attr("data-calories")} calories!`);
    });
});