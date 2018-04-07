'use strict';
$(function(){
  // Setting up the chart area
  var margin = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 40
  };
  var canvasWidth = 600;
  var canvasHeight = 600;
  var width = canvasWidth - margin.left - margin.right;
  var height = canvasHeight - margin.top - margin.bottom;
  var svg = d3.select('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);

    // Add area for points
  var graphArea = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xScale = d3.scale.linear().range([0, width]);
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10);

  var yScale = d3.scale.linear().range([height, 0]);
  var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

  var colorScale = d3.scale.category10();

  // Step 1: edit data.csv to include the data you want to show
  d3.csv('data.csv', function(data) {
    // Step 2: Create x and y scales (scaleLinear) to draw points.
    // Set xScale and yScale to the scales so you can use them outside this function.

    // Add code here
    // xScale =
    // yScale =

    var xColumn = 'weight_' + String('2012');
    var yColumn = 'price_' + String('2012');

    // change string (from CSV) into number format
    data.forEach(function(d) {
      d[xColumn] = +d[xColumn];
      d[yColumn] = +d[yColumn];
    });

    // x -> weight
    // y -> price

    xScale.domain([
    	d3.min([0,d3.min(data,function (d) { return d[xColumn] })]),
    	d3.max([0,20 + d3.max(data,function (d) { return d[xColumn] })])
    ]);
    yScale.domain([
    	d3.min([0,d3.min(data,function (d) { return d[yColumn] })]),
    	d3.max([0,20 + d3.max(data,function (d) { return d[yColumn] })])
    ]);

    // Step 3: Add code to color the points by category (add code here or above)

    graphArea.selectAll(".dot")
                .data(data)
             .enter()
                .append("circle")
                  .attr("class", "dot")
                  .attr("r", 10)
                  .style("stroke", "black")
                  .attr("cx", function(d) { return xScale(d[xColumn]); })
                  .attr("cy", function(d) { return yScale(d[yColumn]); })
                  .style("fill", function(d) { return colorScale(d.category); })
                  .on('mouseover', function () { // step-5 Adding mouse hover animation
                    d3.select(this)
                      .transition()
                      .duration(500)
                      .attr('r',20)
                      .attr('stroke-width',3) //step-5 adding stroke width to circles
                    })
                  .on('mouseout', function () { // step-5 Adding mouse hover animation
                    d3.select(this)
                      .transition()
                      .duration(500)
                      .attr('r',10)
                      .attr('stroke-width',1)
                  })
                .append('title') // Tooltip
                  .text(function (d) { return 'Name:         ' + d.name + '\nCategory:  ' + d.category + '\nWeight:      ' + String(d[xColumn]) + ' grams\nPrice:           ' + String(d[yColumn]) + ' cents'; });

    // // Add axes (uncomment this code to add axes)
    graphArea.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (height) + ')')
                .call(xAxis)
              .append("text") //step-5 Adding label to x axis
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("Weight (in grams)"); //Step-5 Adding title to the x - axis

    graphArea.append('g')
                .attr('class', 'y axis')
                .call(yAxis) //step- 5 Adding label to y axis
              .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price (in cents)"); //Step-5 Adding title to the y - axis
  });

  // Animate points
  var originalYear = 2012;
  var maxYear = 2017;
  var year = originalYear;
  d3.select('#nextButton').on('click', function(event) {
    if (year == maxYear) {
      year = originalYear;
    } else {
      year = year + 1;
    }

    $('p#status').text('Year: ' + String(year));
    var xColumn = 'weight_' + String(year);
    var yColumn = 'price_' + String(year);

    // Step 4: Animate changing the points shown by year here
    d3.csv('data.csv', function(data) {
      console.log(xColumn);
      console.log(yColumn);
      xScale.domain([
        d3.min([0, d3.min(data, function(d) {
          return +d[xColumn]
        })]),
        d3.max([0, 20 + d3.max(data, function(d) {
          return +d[xColumn]
        })])
      ]);
      yScale.domain([
        d3.min([0, d3.min(data, function(d) {
          return +d[yColumn]
        })]),
        d3.max([0, 20 + d3.max(data, function(d) {
          return +d[yColumn]
        })])
      ]);

      // Update circles
      svg.selectAll("circle")
        .data(data) // Update with new data
        .transition() // Transition from old to new
        .duration(1000) // Length of animation
        .each("start", function() { // Start animation
          d3.select(this)
            .attr("r", 15);
        })
        .delay(function(d, i) {
          return i / 20 * 500;
        })
        .attr("cx", function(d) {
          return xScale(+d[xColumn]);
        })
        .attr("cy", function(d) {
          return yScale(+d[yColumn]);
        })
        .each("end", function() { // End animation
          d3.select(this)
            .transition()
            .duration(500)
            .attr("fill", function(d) { return colorScale(d.category); }) // Change color
            .attr("r", 10); // Change radius
        });

      // Step - 5 Update tooltips
      svg.selectAll("title")
        .data(data) // Tooltip
        .text(function (d) { return 'Name:         ' + d.name + '\nCategory:  ' + d.category + '\nWeight:      ' + String(d[xColumn]) + ' grams\nPrice:           ' + String(d[yColumn]) + ' cents'; });

      // Update X Axis
      svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);

      // Update Y Axis
      svg.select(".y.axis")
        .transition()
        .duration(100)
        .call(yAxis);
    });

  });

});

// Step 5: make some other change to the graph
// Updated mouseout and mouseover - marked in comments above
// Added tooltips - marked in comments above
//The code modification I made in PART-5 are
//A) Adding the tooltip - the tooltip displays the values of x and y-axis - weight (in grams), price (in cents) along with the name of instance i.e the name of the fruit or vegetable and the category it belongs to (fruit or vegetable).
//B) Adding the mouse out and mouse over to make the point/circle bigger when a mouse hovers on a point.
//C) Adding titles to the x (Weight in grams) and y-axis (Price in cents)
