//https://blog.logrocket.com/data-visualization-d3-js-node-js/

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
    const data = getSugarData();
    const svgWidth = 500;
    const svgHeight = 500;
    const barPadding = 5;
    const barWidth = svgWidth / data.length;

    let svg = d3.select("svg");
    let width = svg
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    svg
        .selectAll("rect")
        .data(data)
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
