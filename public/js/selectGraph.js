
document.addEventListener("DOMContentLoaded", () => {
    $("#graph-select").change(function(){
        $(".chart-div").hide()
       $(`#${$("option:selected", this).attr("data-chart-id")}-div`).show()
    })
  });