// @TODO: YOUR CODE HERE!
// chart width and height
var svgWidth = 950;
var svgHeight = 600;

var margin = {top: 20, right: 40, bottom: 60, left: 80};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg and append to hold chart
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(successHandle, errorHandle);

function errorHandle(error) {
  throw err;
}
function successHandle(theData) {

  theData.forEach(function (data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
});

  // scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([3, d3.max(theData, d => d.healthcare)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([6, d3.max(theData, d => d.poverty)])
    .range([height, 0]);
  
  // axis functions
  var bottomAxis = d3.axisBottom(xLinearScale)
    .ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append the axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);


  // Create circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(theData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "12")
    .attr("fill", "deepskyblue")
    .attr("opacity", ".67")


  // Append text to circles 
  var circlesGroup = chartGroup.selectAll()
    .data(theData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.healthcare))
    .attr("y", d => yLinearScale(d.poverty))
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

  // tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>healthcare: ${d.healthcare}%<br>poverty: ${d.poverty}% `);
    });

  chartGroup.call(toolTip);

  // event listeners
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // axis labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}
