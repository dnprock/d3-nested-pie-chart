# Nested Pie Chart using d3.js

See the [demo](http://aashe.github.io/d3-nested-pie-chart).

## Background

We built a simple visualization to display some nested scoring data. For
example, people can score on several nested categories. We could describe the
structure easily with an outline:

  - Category (4 of 10)
    - Subcategory (20 of 22)
    - Subcategory (8 of 8)
    - Subcategory (13 of 14)
  - Category (6 of 10)
    - Subcategory (20 of 20)
      - Subcategory (2 of 3)
      - Subcategory (3 of 3)
    - Subcategory (4 of 11)
  - Category (3 of 8)
    - Subcategory (1 of 1)
    - Subcategory (33 of 80)
    - Subcategory (12 of 30)

Each category or subcategory represents a slice of the pie chart. Each slice is
filled out to a certain percentage, representing their score. For example, the
first category above would fill 40% of the area of the pie slice. The slice
itself would actually be just over a 3rd of the overall pie chart, since it's
worth 10 and the other two are 10 and 8.

Clicking on a slice then clears the chart and brings up the child pie chart on
down the tree. A small circle is drawn in the center as a button to go back up
a level.

Currently each level is called from a JSON file (or api call). This may make
sense to change eventually, by allowing a single file.
