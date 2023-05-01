import * as charts from "https://cdnjs.com/libraries/Chart.js"
import axios from 'https://cdn.skypack.dev/axios';


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
    let myChart = document.getElementByID('chart').getContext('2d');

    let sugarChart =   new charts.Chart(myChart, 
        {
            type: 'bar',
            data:
            {
                labels: date,
                datasets:[{label:'sugars', data: sugar, backgroundColor:'blue'}]
            }
        })
}
drawChart();