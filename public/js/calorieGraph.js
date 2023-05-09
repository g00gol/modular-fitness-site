// import * as charts from "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.3.0/chart.cjs.map"
// import axios from 'https://cdn.skypack.dev/axios';

//https://www.youtube.com/watch?v=sE08f4iuOhA
const getCalorieData = async () =>
{
    try
    {
        let calorieData = await axios.post('/api/calorie')
        return calorieData.data
    }
    catch (e)
    {
        throw e
    }
}
let calorieChart;
export async function drawChart() 
{
    const data = await getCalorieData();

    console.log(data);

    
    let date = []
    let totalCalories = []

    console.log(data);

    for(let x = 0; x <data.length; x++)
    {
        date.push(data[x].date)
        totalCalories.push(data[x].totalCalories)

    }

    let myChart = document.getElementById('calorieChart').getContext('2d');

calorieChart =   new Chart(myChart, 
        {
            type: 'bar',
            data:
            {
                labels: date, 
                datasets: [
                    {
                      label: 'Calories',
                      data: totalCalories,
                      backgroundColor: "green",
                    }]
            }
        })
}
drawChart();

