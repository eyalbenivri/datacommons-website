# Data Commons Chart Component APIs

## Including the library

Embed [Data Commons](https://datacommons.org) charts in your web pages including
datacommons.js and styles in your webpage's `<head></head>` tags. These files
must be included for the web components to work.

```html
<link rel="stylesheet" href="https://datacommons.org/css/ranking.min.css" />
<link rel="stylesheet" href="https://datacommons.org/css/nl_interface.min.css" />
<script src="https://datacommons.org/datacommons.js"></script>
```

### Example

```html
<html>
  <head>
    <link rel="stylesheet" href="https://datacommons.org/css/ranking.min.css" />
    <link rel="stylesheet" href="https://datacommons.org/css/nl_interface.min.css" />
    <script src="https://datacommons.org/datacommons.js"></script>
  </head>
  <body>
    <!-- Embed a bar chart of the population of US states-->
    <datacommons-bar
        title="Population of US States"
        place="country/USA"
        childPlaceType="State"
        variable="Count_Person"
    ></datacommons-bar>
  </body>
</html>
```

Each web component is a custom HTML element that takes a set of attributes.

## Bar Chart

Element Syntax:
```html
<datacommons-bar></datacommons-bar>
```

### Attributes

Required:

- `childPlaceType` _string_
  - Type of child places to plot.
- `place` _string_
  - Type of child places to plot.
- `title` _string_
  - Title of the chart.
- `variable` _string_
  - DCID of the variable to plot.

Optional:

- `barHeight` _number_
  - Bar height for horizontal charts, in px.
- `comparisonPlaces` _list of strings_
  - List of DCIDs of specific places to plot.
  - If provided, `place` and `childPlaceType` will be ignored.
  - Use the format `"list-item-1 list-item-2"` (space separated list).
- `comparisonVariables` _list of strings_
  - List of DCIDs of multiple variables to plot.
  - If provided, `variable` will be ignored.
  - Use the format `"list-item-1 list-item-2"` (space separated list).
- `maxPlaces` _number_
  - Maximum _number_ of child places to plot.
- `sort` _string_
  - Bar chart sort order
  - Options:
    - `ascending` (ascending by the variable's value)
    - `descending` (descending by the variable's value)
    - `ascendingPopulation` (ascending by the place's population)
    - `descendingPopulation` (descending by the place's population)
  - Default: `descendingPopulation`

Styling Options:

- `horizontal` _boolean_
  - Set to true to draw bars horizontally instead of vertically
- `stacked` _boolean_
  - Set to true to draw as stacked bar chart instead of grouped chart
- `lollipop` _boolean_
  - Set to true to draw lollipops instead of bars.
  - Note: only works when `horizontal` is false.

### Examples

A bar chart of population for states in the US:

```html
<datacommons-bar
    title="Population of US States"
    place="country/USA"
    childPlaceType="State"
    variable="Count_Person"
></datacommons-bar>
```

A bar chart of population for specific US states:

```html
<datacommons-bar
    title="Population of US States"
    variable="Count_Person"
    comparisonPlaces="geoId/01 geoId/02"
></datacommons-bar>
```

A stacked bar chart of population for specific US states:

```html
<datacommons-bar
    title="Population of US States"
    variableDcid="Count_Person"
    comparisonPlaces="geoId/01 geoId/02"
    stacked
></datacommons-bar>
```

A horizontal, stacked bar chart of median income for specific US states:

```html
<datacommons-bar
    title="Median income by gender"
    comparisonVariables='["Median_Income_Person_15OrMoreYears_Male_WithIncome", "Median_Income_Person_15OrMoreYears_Female_WithIncome"]'
    comparisonPlaces="geoId/01 geoId/02 geoId/04 geoId/20 geoId/21 geoId/22 geoId/23 geoId/24 geoId/25"
    stacked
    horizontal
    sort="descending"
></datacommons-bar>
```

A lollipop chart of population for states in the US:

```html
<datacommons-bar
    title="Population of US States"
    place="country/USA"
    childPlaceType="State"
    variable="Count_Person"
    lollipop
></datacommons-bar>
```

## Gauge Chart

Element Syntax:
```html
<datacommons-gauge></datacommons-gauge>
```

### Attributes

Required:

- `childPlaceType` _string_
  - Type of child places to plot.
- `max` _number_
  - Maximum value of the gauge's range.
- `min` _number_
  - Minimum value of the gauge's range.
- `place` _string_
  - Type of child places to plot.
- `title` _string_
  - Title of the chart.
- `variable` _string_
  - DCID of the variable to plot.

### Examples

A gauge of the percentage of people who are internet users in the US

```html
<datacommons-gauge
    title="Percentage of US Population that are Internet Users"
    place="country/USA"
    variable="Count_Person_IsInternetUser_PerCapita"
    min="0"
    max="100"
></datacommons-gauge>
```

## Line Chart

Element Syntax:
```html
<datacommons-line></datacommons-line>
```

### Attributes

Required:

- `place` _string_
  - Type of child places to plot.
- `title` _string_
  - Title of the chart.
- `variables` _list of strings_
  - List of DCIDs of the variables to plot.
  - Use the format `"list-item-1 list-item-2"` (space separated list).

### Examples

A line chart of how the population below poverty level in the US changed over time:
```html
<datacommons-line
    title="Population Below Poverty Level Status in Past Year in States of United States (2020)"
    place="country/USA"
    variables="Count_Person_BelowPovertyLevelInThePast12Months"
></datacommons-line>
```

## Map Chart

Element Syntax:
```html
<datacommons-map></datacommons-map>
```

### Attributes

Required:

- `childPlaceType` _string_
  - Type of child places to plot.
- `date` _string_
  - Specific date to show data for.
  - Date should be formatted in ISO 8601 (e.g. "YYYY", "YYYY-MM", "YYYY-MM-DD")
    and match the format used by the variable being plotted.
- `place` _string_
  - Type of child places to plot.
- `title` _string_
  - Title of the chart.
- `variable` _string_
  - DCID of the variable to plot

Optional:

- `subscribe` _string_
  - Event channel to subscribe to.
  - The event channel must match the event channel of the [slider component](#map-chart-time-slider)
    controlling the map.

### Examples

A map of population below poverty level in US States:

```html
<datacommons-map
    title="Population Below Poverty Level Status in Past Year in States of United States"
    place="country/USA"
    childPlaceType="State"
    variable="Count_Person_BelowPovertyLevelInThePast12Months"
></datacommons-map>
```

A map of population below poverty level in US States, in the year 2020:

```html
<datacommons-map
    title="Population Below Poverty Level Status in Past Year in States of United States (2020)"
    place="country/USA"
    childPlaceType="State"
    variable="Count_Person_BelowPovertyLevelInThePast12Months"
    date="2020"
></datacommons-map>
```

## Map Chart Time Slider

Element Syntax:
```html
<datacommons-slider></datacommons-slider>
```

### Attributes

Required:

- `max` _number_
  - Maximum slider value.
- `min` _number_
  - Minimum slider value
- `publish` _string_
  - Event name to publish on slider change
- `value` _number_
  - Initial slider value

### Examples

A single slider controlling the date on a map, with event channel name "dc-map":

```html
<!-- Date slider example  -->
<datacommons-slider
    max="2023"
    min="1950"
    publish="dc-year"
    value="2023"
></datacommons-slider>

<!-- Map that subscribes to slider changes -->
<datacommons-map
    title="Population"
    place="country/USA"
    childPlaceType="State"
    subscribe="dc-map"
    variable="Count_Person"
></datacommons-map>
```

## Pie / Donut Chart

Element Syntax:
```html
<datacommons-pie></datacommons-pie>
```

### Attributes

Required:

- `date` _string_
  - Specific date to show data for.
  - Date should be formatted in ISO 8601 (e.g. "YYYY", "YYYY-MM", "YYYY-MM-DD")
    and match the format used by the variable being plotted.
- `place` _string_
  - Type of child places to plot.
- `title` _string_
  - Title of the chart.
- `comparisonVariables` _list of strings_
  - List of DCIDs of the variable to plot
  - Use the format `"list-item-1 list-item-2"` (space separated list).

Optional:

- `donut` _boolean_
  - Set to true to draw as a donut chart instead of a pie chart.

### Examples

A pie chart of median income by gender in California

```html
<datacommons-pie
    title="Median Income by gender in California"
    place="geoId/06"
    comparisonVariables="Median_Income_Person_15OrMoreYears_Male_WithIncome Median_Income_Person_15OrMoreYears_Female_WithIncome"
></datacommons-pie>
```

A donut chart of median income by gender in California

```html
<datacommons-pie
    title="Median Income by gender in California"
    place="geoId/06"
    comparisonVariables="Median_Income_Person_15OrMoreYears_Male_WithIncome Median_Income_Person_15OrMoreYears_Female_WithIncome"
    donut
></datacommons-pie>
```

## Ranking Chart

Element Syntax:
```html
<datacommons-ranking></datacommons-ranking>
```

### Attributes

Required:

- `childPlaceType` _string_
  - Type of child places to plot.
- `place` _string_
  - Type of child places to plot.
- `title` _string_
  - Title of the chart.
- `variable` _string_
  - DCID of the variable to plot

Optional:

- `showLowest` _boolean_
  - Whether to show a lowest-to-highest ranking.
  - To show places with lowest value first, set to true.
  - If not provided, defaults to highest-to-lowest by variable value.

### Examples

Show a ranking of US States by population, highest to lowest

```html
<datacommons-ranking
    title="US States with the Highest Population"
    place="country/USA"
    childPlaceType="State"
    variable="Count_Person"
></datacommons-ranking>
```

Show a ranking of US States by population, lowest to highest

```html
<datacommons-ranking
    title="US States with the Lowest Population"
    place="country/USA"
    childPlaceType="State"
    variable="Count_Person"
    showLowest=true
></datacommons-ranking>
```