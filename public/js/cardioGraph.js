// import * as charts from "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.3.0/chart.cjs.map"
// import axios from 'https://cdn.skypack.dev/axios';

//https://www.youtube.com/watch?v=sE08f4iuOhA
const getCardioData = async () =>
{
    try
    {
        let cardioData = await axios.post('/api/cardio')
        return cardioData.data
    }
    catch (e)
    {
        throw e
    }
}
let cardioChart;
export async function drawChart() 
{
    const data = await getCardioData();

    console.log(data);

    let date = [];
    let type = [];
    let distance = [];
    let duration = [];
    let calories = [];

    for(let x = 0; x <data.length; x++)
    {
        date.push(data[x].date)
        type.push(data[x].type)
        distance.push(data[x].distance)
        duration.push(data[x].duration)
        calories.push(data[x].caloriesBurned)
    }

    let dateType = [];
    for(let i = 0; i< data.length; i++){
        dateType.push(`${type[i]} on ${date[i]}`)
    }

    let myChart = document.getElementById('cardioChart').getContext('2d');

cardioChart =   new Chart(myChart, 
        {
            type: 'bar',
            data:
            {
                labels: dateType, 
                datasets: [
                    {
                      label: 'Distance',
                      data: distance,
                      backgroundColor: "red",
                    },
                    {
                      label: 'Duration',
                      data: duration,
                      backgroundColor: "green",
                    },
                    {
                        label: 'Calories Burned',
                        data: calories,
                        backgroundColor: "yellow",
                      }
                  ]
                // datasets:[{label:'Distance (mi)', data: distance, backgroundColor:colors.type}, 
                //         {label:'Duration (min)', data: duration, backgroundColor:colors.type},
                //         {label:'Calories Burned', data: calories, backgroundColor:colors.type}]
            }
        })
}
drawChart();

