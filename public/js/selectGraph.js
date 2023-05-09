
document.addEventListener("DOMContentLoaded", () => {
    $("#graph-select").change(function(){
        $(".chart-div").hide()
       $(`#${$("option:selected", this).attr("chart-id")}-div`).show()
    })
  });