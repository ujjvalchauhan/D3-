var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params -> WORKING !!!!
var chosenXAxis = "income";
var xTipLabel = "Income: ";
var chosenYAxis = "noHealthInsurance";
var yTipLabel = "Lacks HIns: ";

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv", function(err, Data) {
    if (err) throw err;
  
    // parse data
    Data.forEach(function(data) {
    // X-axis data
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
    // Y-axis data
        data.noHealthInsurance = +data.noHealthInsurance;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
      d3.max(Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenYAxis]), d3.max(Data, d => d[chosenYAxis])])
      .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(Data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 15);
      
      circlesGroup.attr("fill", "#89bdd3")
      .attr("opacity", ".7");
      /*.attr("x", d => d[chosenXAxis])
      .attr("y", d => d[chosenYAxis])
      .attr("text", d => d["abbr"]);*/
    
      var circleText = chartGroup.selectAll("circleText")
      .data(Data)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 0)
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text(d => d["abbr"]);

       
    // append x axis; Create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("inactive", true)
      .text("In Poverty (%)");
  
    var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (median)");
    
    var incomeLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("active", true)
      .text("Household Income (median)");
  
    // append y axis; Create group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");

    var obesityLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obesity (%)");

    var smokesLabel = yLabelsGroup.append("text")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");

    var noHealthInsuranceLabel = yLabelsGroup.append("text")
      .attr("y", 40 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "noHealthInsurance")
      .classed("active", true)
      .text("Lacks Health Insurance (%)");
    
    // start tooltips with initial info
    circlesGroup = updateToolTip(chosenXAxis, xTipLabel, yTipLabel, chosenYAxis, circlesGroup);

    // x axis labels event listener
  xLabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var axis = d3.select(this).attr("x");
    var value = d3.select(this).attr("value");
    console.log(axis, value, chosenXAxis);
    // If conditions does not work when using '&& axis === 0' ???
    // if condition and X Axis Labels now WORKING !!!
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
        d3.max(Data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

      // updates x axis with transition
      //xAxis = renderAxes(xLinearScale, xAxis);
      var bottomAxis = d3.axisBottom(xLinearScale);
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

      // updates circles with new x values
      //circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
      circlesGroup.transition()
                    .duration(1000)
                    .attr("cx", d => xLinearScale(d[chosenXAxis]));
                    //.attr("x", d => d[chosenXAxis]);
                    //.select("text").attr("x", d => d[chosenXAxis]);
      circleText.transition()
                  .duration(1000)
                  .attr("x", d => xLinearScale(d[chosenXAxis]));

      
      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        xTipLabel = "Poverty: ";
      }
      else if (chosenXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        xTipLabel = "Age: ";
      }
      else {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        xTipLabel = "Income: ";
      }
    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, xTipLabel, yTipLabel, chosenYAxis, circlesGroup);
    }
  });
  // y axis labels event listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var axis = d3.select(this).attr("y");
    var value = d3.select(this).attr("value");
    console.log(axis, value, chosenYAxis);
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      console.log(chosenYAxis)

      // functions here found above csv import
      // updates y scale for new data
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(Data, d => d[chosenYAxis]), d3.max(Data, d => d[chosenYAxis])])
        .range([height, 0]);

      // updates y axis with transition
      var leftAxis = d3.axisLeft(yLinearScale);
        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

      // updates circles with new y values
      circlesGroup.transition()
                    .duration(1000)
                    .attr("cy", d => yLinearScale(d[chosenYAxis]));
                    //.attr("y", d => d[chosenYAxis]);
                    //.select("text").attr("y", d => d[chosenYAxis]);
      circleText.transition()
                    .duration(1000)
                    .attr("y", d => yLinearScale(d[chosenYAxis]));

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        noHealthInsuranceLabel
          .classed("active", false)
          .classed("inactive", true);
        yTipLabel =  "Obesity: ";
      }
      else if (chosenYAxis === "smokes") {
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        noHealthInsuranceLabel
          .classed("active", false)
          .classed("inactive", true);
        yTipLabel = "Smokes: ";
      }
      else {
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        noHealthInsuranceLabel
          .classed("active", true)
          .classed("inactive", false);
        yTipLabel = "Lacks HIns: ";
      }

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenYAxis, yTipLabel, xTipLabel, chosenXAxis, circlesGroup);
    }
  });
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenAxis, axisLabel, otherLabel, otherAxis, circlesGroup) {

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${axisLabel} ${d[chosenAxis]}<br>${otherLabel} ${d[otherAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
  }
});
