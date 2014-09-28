function d3NestedPieChart() {
  var width = 720, // default width
      height = 720, // default height
			fillPalette = [
			  "#0080CF", "#00BCE4",
				"#6BBC49", "#CEDC45",
				"#5160AB", "#A486BD"
			],
			strokePalette = [
				"#15387F", "#15387F",
				"#00A060", "#00A060","#3C2985"
			],
			fillFunc = function() {
					return d3.scale.ordinal().range(fillPalette);
			},

			strokeFunc = function() {
					return d3.scale.ordinal().range(strokePalette);
			};

  function my(selection) {
  	selection.each(function(d, i) {
	    // generate chart here; `d` is the data and `this` is the element
	  });
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
