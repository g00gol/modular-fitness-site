
//https://www.youtube.com/watch?v=sE08f4iuOhA
const getweightData = async () =>
{
    try
    {
        let weightData = await axios.post('/api/weight')
        return weightData.data
    }
    catch (e)
    {
        throw e
    }
}
let weightChart;
export async function drawChart() 
{
    const data = await getweightData();
    let weight = [];
    let date = [];
    for(let x = 0; x <data.length; x++)
    {
        weight.push(data[x].weight)
        date.push(data[x].time)
    }
    let myChart = document.getElementById('weightChart').getContext('2d');

    weightChart =   new Chart(myChart, 
        {
            type: 'bar',
            data:
            {
                labels: date,
                datasets:[{label:'weight', data: weight, backgroundColor:'green'}]
            }
        })
}
drawChart();
