// import * as charts from "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.3.0/chart.cjs.map"
// import axios from 'https://cdn.skypack.dev/axios';

//https://www.youtube.com/watch?v=sE08f4iuOhA
const getSugarData = async () =>
{
    try
    {
        let sugarData = await axios.post('/api/sugar')
        return sugarData.data
    }
    catch (e)
    {
        throw e
    }
}

async function drawChart() 
{
    const data = await getSugarData();
    let sugar = [];
    let date = [];
    for(let x = 0; x <data.length; x++)
    {
        sugar.push(data[x].sugarReading)
        date.push(data[x].time)
    }
    let myChart = document.getElementById('charts').getContext('2d');

    let sugarChart =   new Chart(myChart, 
        {
            type: 'bar',
            data:
            {
                labels: date,
                datasets:[{label:'sugars', data: sugar, backgroundColor:'green'}]
            }
        })
}
drawChart();