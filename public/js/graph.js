//https://blog.logrocket.com/data-visualization-d3-js-node-js/
import * as d3 from "https://cdn.skypack.dev/d3@7";
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

async function drawChart() {
    const data = await getSugarData();
    let sugar = [];
    let date = [];
    for(let x = 0; x <data.length; x++)
    {
        sugar.push(data[x].sugarReading)
        date.push(data[x].time)
    }
    
    console.log(sugar)
    console.log(date)

    const svgWidth = 500;
    const svgHeight = 500;
    const barPadding = 20;
    const barWidth = svgWidth / data.length;
    

    let svg = d3.select("svg");
    let width = svg
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    let xScale = d3.scaleBand().range([0, svgWidth]).padding(0.5),
    yScale = d3.scaleLinear().range([svgHeight, 0]);

    xScale.domain(date);
    yScale.domain(sugar);




    svg
    .selectAll("rect")
    .data(sugar)
    .enter()
    .append("rect")
    .attr("y", (d) => svgHeight - d)
    .attr("height", (d) => d)
    .attr("width", () => barWidth - barPadding)
    .attr("transform", (d, i) => {
        let translate = [barWidth * i, 0];
        return `translate(${translate})`;
    })
    .style("fill", "steelblue");
    
}
drawChart();
