function d3NestedPieChart() {
  var all_data;

  var config = {
      width: 700, height: 700,
  	  fillColor1: "#0080CF", fillColor2: "#00BCE4",
  		fillColor3: "#6BBC49", fillColor4: "#CEDC45",
  		fillColor5: "#5160AB", fillColor6: "#A486BD",
  		strokeColor1: "#15387F", strokeColor2: "#15387F",
  		strokeColor3: "#00A060", strokeColor4: "#00A060",
      strokeColor5: "#3C2985"
    };

  fill_func = function() {
      return d3.scale.ordinal().range(fillPalette);
  };

  stroke_func = function() {
      return d3.scale.ordinal().range(strokePalette);
  };

  function tweenOpacity(o) {
    return function(d, i, a) {
        return d3.interpolate(a, o)
    }
  }

  var fillPalette = [
      config.fillColor1, config.fillColor2,
      config.fillColor3, config.fillColor4,
      config.fillColor5, config.fillColor6
      //"#0080CF", "#00BCE4",
      //"#6BBC49", "#CEDC45",
      //"#5160AB", "#A486BD"
  ]
      // "#a9ad70", "#aa9882", "#b1adac", "#bfb18e",
  var strokePalette = [
    config.strokeColor1, config.strokeColor2,
    config.strokeColor3, config.strokeColor4, config.strokeColor5
  	//"#15387F", "#15387F",
  	//"#00A060", "#00A060","#3C2985"
  ];

  var width = config.width, height = config.height;
  var margin = {top: 40, bottom: 40};
  
  var my_selection;

  function tweenOpacity(o) {
    return function(d, i, a) {
        return d3.interpolate(a, o)
    }
  }

  function drawChart() {
  	my_selection.each(function(d, i) {
      all_data = d;
      var r = width / 2 - margin.top - margin.bottom,
          inner_r = r*.1
          label_r = r*1.25,
          top_chart_name = "pie1",
          fill_color = fill_func(),
          stroke_color = stroke_func();
      var arc = d3.svg.arc().outerRadius(r).innerRadius(inner_r);
      var label_arc = d3.svg.arc().innerRadius(inner_r).outerRadius(label_r);
      var donut = d3.layout.pie();

      // Queue keeps track of all the previous parents
      var default_title = "Average Scores";
      var parent_stack = [
                          	{
                          		'name': top_chart_name,
                          		'title': default_title
                          	}
                          ]

      /* TWEENS */
      /*     var tweenShowArcs = function (b) {
          var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
          return function(t) {
             var arc2 = d3.svg.arc().outerRadius(r).innerRadius(inner_r);
             return arc2(i(t));
          };
         } */

      var tweenShowFill = function (b) {
       var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
       return function(t) {
          var arc2 = d3.svg.arc().outerRadius((r-inner_r)*b.data.fill_fraction+inner_r).innerRadius(inner_r);
          return arc2(i(t));
       };
      }

      var tweenShowBorder = function (b) {
       var i = d3.interpolate({startAngle: 0, endAngle: 0, innerRadius: 0}, b);
       return function(t) {
          var arc2 = d3.svg.arc().outerRadius(r).innerRadius(inner_r);
          return arc2(i(t));
       };
      }

      var tweenShowButton = function (b) {
       var i = d3.interpolate({radius: 0}, b);
       return function(t) {
          var arc2 = d3.svg.arc().outerRadius(r).innerRadius(inner_r);
          return arc2(i(t));
       };
      }

      var tweenHidePie = function (b) {
          var i = d3.interpolate({}, b);
          return function(t) {
             var arc2 = d3.svg.arc().outerRadius(0).innerRadius(0);
             return arc2(i(t));
          };
         }

      /* Data filtering functions */
      var id_inner = function(d, i) {
          return d.data.id;
      }
      var id_func = function() {
          return id_inner;
      }
      var d_inner = function(d) {
          return d.value;
      }
      var d_func = donut.value(d_inner);

      function drawPie(canvas, classname, data, parent_slice, parent_classname)
      {
          canvas.data([data]);

          var arcs = canvas.selectAll("g." + classname + "_arcs")
             .data(d_func, id_inner)
           .enter().append("svg:g")
             .attr("class", classname + "_arcs")
             .on('click', function(d, i) { return selectSlice(d, i, classname, parent_slice); })
             .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

          arcs.append("svg:title")
          	.text(function(d, i) { return d.data.long_title + "\n\n  (" + Math.round(d.data.fill_fraction*100) + "%)" });

          var fills = arcs.append("svg:path")
             .attr("class", classname + "_fills")
             .attr("fill", function(d, i) { return fill_color(i); })
             .attr("stroke", function(d, i) { return stroke_color(i); });

           var lines = arcs.append("svg:path")
          	.attr("class", classname + "_lines")
             .attr("fill", 'transparent')
             .attr("stroke", "#aaaaaa")

          var getLabelText = function(d, i) {
           	 if(d.endAngle - d.startAngle > .2)
          	 	return d.data.title;
          	 else
          		 return ""
           }

          var labels = arcs.append("svg:text")
          	.attr("class", classname + "_labels")
             .attr("transform", function(d) {
                 var c = arc.centroid(d),
                     x = c[0],
                     y = c[1],
                     // pythagorean theorem for hypotenuse
                     h = Math.sqrt(x*x + y*y);
                 return "translate(" + (x/h * label_r) +  ',' +
                    (y/h * label_r) +  ")";
             })
             .attr("text-anchor", "middle")
             .style("opacity", 0)
             .text(getLabelText);

          runShowTweens(lines, fills, labels);
      }

      var runShowTweens = function(lines, fills, labels)
      {
          lines.transition()
            .ease("bounce")
            .duration(750)
            .attrTween("d", tweenShowBorder);

          fills.transition()
             .ease("bounce")
             .delay(500)
             .duration(750)
             .attrTween("d", tweenShowFill);

          labels.transition()
          	.ease("bounce")
             .delay(500)
             .duration(750)
             .styleTween("opacity", tweenOpacity(100));
      }

      var up = function()
      {
      	if(parent_stack.length > 1)
      	{
          	parent = parent_stack.pop()
         		classname = parent.name
          	parent_classname = parent_stack[parent_stack.length-1].name
         		title = parent_stack[parent_stack.length-1].title
          	// remove current
          	labels = d3.selectAll("." + classname + "_labels")
          	labels.transition()
              	.ease("sin")
                  .duration(1000)
                  .styleTween("opacity", tweenOpacity(0));
          	fills = d3.selectAll("." + classname + "_fills")
          	fills.transition()
              	.ease("bounce")
                  .duration(1000)
                  .attrTween("d", tweenHidePie);
          	lines = d3.selectAll("." + classname + "_lines")
          	lines.transition()
              	.ease("bounce")
                  .duration(1000)
                  .attrTween("d", tweenHidePie);

          	if(parent_stack.length == 1)
          		d3.select("#reset_button").attr("class", "reset_button_disabled")

          	d3.select("#pie_title").text(title);

          	// unhide parents

          	labels = d3.selectAll("." + parent_classname + "_labels")
          	fills = d3.selectAll("." + parent_classname + "_fills")
          	lines = d3.selectAll("." + parent_classname + "_lines")
          	runShowTweens(lines, fills, labels);
      	}
      }

      var selectSlice = function(d, i, classname, parent_slice)
      {
      	chart_data = d.data.child_chart;

      	new_classname = d.data.id;

      	if(chart_data) {
          	// Hide parents
          	d3.selectAll("." + classname + "_labels")
          		.transition()
              	.ease("sin")
                  .duration(1000)
                  .styleTween("opacity", tweenOpacity(0));

          	d3.selectAll("." + classname + "_fills")
          		.transition()
              	.ease("bounce")
                  .duration(1000)
                  .attrTween("d", tweenHidePie);

          	d3.selectAll("." + classname + "_lines")
          		.transition()
              	.ease("bounce")
                  .duration(1000)
                  .attrTween("d", tweenHidePie);

      		d3.select("#reset_button")
      	      .attr("class", "reset_button")

      /*           	vis.append("svg:circle")
                  .attr("cx", w / 2)
                  .attr("cy", h / 2)
                  .attr("r", inner_r * .9)
                	.attr("id", new_classname + "_button")
                	.attr("class", "reset_button")
                	.on('click', function() { return up(new_classname, parent_slice, classname); }); */

      		parent_stack.push(
      							{
      								'name': new_classname,
      								'title': d.data.title
      							}
      						);
              d3.select("#pie_title").text(d.data.title);

          	// Draw the new one if it doesn't already exist
          	fills = d3.selectAll("." + new_classname + "_fills")
          	if(fills[0].length == 0) {
              	draw_wrapper = function(vis, classname, parent_slice, parent_classname) {
                      return function(json) {
                      	data = json.slices;
                          drawPie(vis, classname, data, parent_slice, parent_classname);
                      }
              	}
              	var child_data = all_data.objects.filter(function(d) {
              	  return d.name === chart_data;
              	});

              	drawPie(vis, new_classname, child_data[0].slices, d, classname);

              	//draw_wrapper(child_data, new_classname, d, classname);
              	//d3.json(chart_data, draw_wrapper(vis, new_classname, d, classname));
          	}
          	else {
          		runShowTweens(d3.selectAll("." + new_classname + "_lines"), d3.selectAll("." + new_classname + "_fills"), d3.selectAll("." + new_classname + "_labels"));
          	}
      	}
      }

      //setup svg canvas
      var vis = d3.select("#viz")
          .append("svg:svg")
             .attr("width", width)
             .attr("height", height)
             .attr("id", "charts");

      // Add the outer circle
      vis.append("svg:circle")
               .attr("class", "border")
               .attr("cx", width / 2)
               .attr("cy", height / 2)
               .attr("r", r);

      vis.append("svg:circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", inner_r * .9)
        .attr("class", "reset_button_disabled")
        .attr("id", "reset_button")
        .on('click', up);

      var title = vis.append("svg:text")
      title.append("svg:tspan")
      	.style("fill", "#333")
      	.style("font-size", "2em")
       	.attr('class', 'pie_title')
       	.attr('x', width / 2)
       	.attr('y', 30)
       	.attr("text-anchor", "middle")
       	.attr('id', 'pie_title')
      	.text(default_title);
      /* 	 	.attr('x', 350)
      	.attr('y', 30)
      	.attr("text-anchor", "middle")
          .style("opacity", 100)
          .text(default_title); */

      /* d3.json("data/subcategories.json", display); */
      document.body.style.cursor = 'wait';

      //console.log('getting data');
      //d3.json("data/top.json", display);
      //console.log('received data');
      // d3.json("/api/v1/summary-pie-chart/", display);
      //d3.json("/api/v1/category-pie-chart/11/", display);
      // d3.json("/api/v1/subcategory-pie-chart/45/", display);

      function display(json) {
          document.body.style.cursor = 'default';
          data = json.objects[0].slices;
          drawPie(vis, top_chart_name, data, null, null);
      }

      display(all_data);
    });
  }

  function my(selection) {
    my_selection = selection;
    drawChart();
    return my;
  }

  my.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return my;
  };

  my.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return my;
  };

  my.fillPalette = function(value) {
  	if (!arguments.length) return fillPalette;
  	fillPalette = value;
  	return my;
  };

  my.strokePalette = function(value) {
  	if (!arguments.length) return strokePalette;
  	strokePalette = value;
  	return my;
  };

  return my;

}
