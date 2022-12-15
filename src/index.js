const fetchDataAndDraw = async () => {
  // Fetching data
  const res = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
  );
  let data = await res.json();
  // console.log(data);

  // Set the titile and description
  let title = document.getElementById("title");
  title.innerText = data.name;
  let description = document.getElementById("description");
  description.innerText =
    "This is the treemap of " + data.name + " grouped by Category.";

  // Modifying data
  let hierarchy = d3
    .hierarchy(data, (node) => {
      return node.children;
    })
    .sum((node) => {
      return node.value;
    })
    .sort((node1, node2) => {
      return node2.value - node1.value;
    });
  // console.log(hierarchy);

  // Draw the treemap
  let createTreeMap = d3.treemap().size([1000, 600]);
  createTreeMap(hierarchy);
  let tiles = hierarchy.leaves();

  let category = tiles.map((d) => {
    return d.data.category;
  });
  category = Array.from(new Set(category));

  // Draw the treemap
  // Build color scale
  let myColor = d3
    .scaleLinear()
    .domain([0, category.length - 1])
    .range(["lightyellow", "green"]);

  // Make tooltip
  let tooltip = d3.select("#tooltip").style("opacity", 0);
  var mouseover = function (d) {
    tooltip.style("opacity", 1);
  };
  var mousemove = function (d) {
    tooltip
      .html(`${d.data.category}<br>${d.data.name}<br>${d.data.value}%`)
      .attr("data-value", d.data.value)
      .style("left", d3.event.pageX)
      .style("top", d3.event.pageY);
  };
  var mouseleave = function (d) {
    tooltip.style("opacity", 0);
  };

  // Set the size
  let height = 600;
  let width = 1000;
  let padding = 60;

  let svg = d3.select("#map").attr("width", width).attr("height", height);

  let block = svg
    .selectAll("g")
    .data(tiles)
    .enter()
    .append("g")
    .attr("transform", (d) => {
      return "translate(" + d.x0 + "," + d.y0 + ")";
    });

  let tile = block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) => {
      let number = category.indexOf(d.data.category);
      return myColor(number);
    })
    .attr("data-name", (d) => {
      return d.data.name;
    })
    .attr("data-category", (d) => {
      return d.data.category;
    })
    .attr("data-value", (d) => {
      return d.data.value;
    })
    .attr("width", (d) => {
      return d.x1 - d.x0;
    })
    .attr("height", (d) => {
      return d.y1 - d.y0;
    })
    .style("outline", "thin solid white")
    // Add Tooltip effect
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  let text = block
    .append("text")
    .selectAll("tspan")
    .data((d) => {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => {
      return 15 + i * 16;
    })
    .text((d) => {
      return d;
    })
    .style("font-size", "12px");

  // Set the size for legend
  let height2 = 60;
  let width2 = 750;
  let padding2 = 60;
  let svg2 = d3.select("#legend").attr("width", width2).attr("height", height2);

  let xAxisScale2 = d3
    .scaleLinear()
    .range([padding2, width2 - padding2])
    .domain([-1, category.length]);
  svg2
    .append("g")
    .call(
      d3.axisBottom(xAxisScale2).ticks(category.length).tickFormat((d,i)=>{
        return category[d]
      })
    )
    .attr("id", "x-axis2")
    .attr("transform", "translate(0, 40)");

  // Add the squares
  svg2
    .selectAll("rect")
    .data(category)
    .enter()
    .append("rect")
    .attr("fill", (d, i) => {
      return myColor(i);
    })
    .attr("class", "legend-item")
    .attr("height", height2 / 2)
    .attr("width", width2 / 30)
    .attr("x", (d, i) => {
      return xAxisScale2(i);
    })
    .attr("y", (d) => {
      return 0;
    })
    .attr("transform", "translate(-12, 10)")
};

fetchDataAndDraw();
