import axios from 'https://cdn.skypack.dev/axios';

document.addEventListener("DOMContentLoaded", () => {
    $("#download-csv").on("click", async function(){
        await axios.get('/myData/download')
        $("#download-here").html(`<a href='../public/data.csv' download='myModeFitnessData'>Download Here</a>`)
    })
})