<script>
    import { 
        line as d3Line,
        curveCatmullRom,
        extent,
        max,
        min,
        quantile,
        scaleTime,
        scaleLinear,
        timeFormat,
        timeParse
    } from "d3";

    export let title;
    export let data;

    // size of the svg
    const width = 100;
    const height = 80;

    const margin = {
      top: 15,
      right: 15,
      bottom: 15,
      left: 15
    };

    // timeParse to parse the input data as to create a date object
    const parseTime = timeParse("%Y-%m-%d %H:%M:%S");
    // timeFormat to style the date objects to a chosen format
    const formatTime = timeFormat("%H:%M");

    // horizontally create a scale based on the input dates
    const xScale = scaleTime()
      .domain(extent(data, d => parseTime(d.date)))
      .range([0, width]);

    // vertically  consider the input values
    const yScale = scaleLinear()
      .domain([min(data, d => d.outsideTemp) - 200, max(data, d => d.outsideTemp) + 1000])
      .range([height, 0]);

    // line function mapping the date and value in the svg
    const outsideTempLine = d3Line()
      .x(d => xScale(parseTime(d.date)))
      .y(d => yScale(d.outsideTemp))
      .curve(curveCatmullRom);

    const entranceTempLine = d3Line()
      .x(d => xScale(parseTime(d.date)))
      .y(d => yScale(d.entranceTemp))
      .curve(curveCatmullRom);

    const kitchenTempLine = d3Line()
      .x(d => xScale(parseTime(d.date)))
      .y(d => yScale(d.kitchenTemp))
      .curve(curveCatmullRom);

    const couloirTempLine = d3Line()
      .x(d => xScale(parseTime(d.date)))
      .y(d => yScale(d.couloirTemp))
      .curve(curveCatmullRom);

    // points highlighted through circle elements
    // in this instance the first and last
    const points = [0, data.length - 1];

    // "ticks", milestones marked on the x-axis
    // instead of using d3, we create here marks for an arbitrary set of dates
    const minDate = min(data, d => parseTime(d.date));
    const maxDate = max(data, d => parseTime(d.date));
    const q1 = quantile(data, 0.25, d => parseTime(d.date));
    const q2 = quantile(data, 0.5, d => parseTime(d.date));
    const q3 = quantile(data, 0.75, d => parseTime(d.date));

    const xAxis = [minDate, q1, q2, q3, maxDate];

    // "ticks" for the y-axis
    // the idea is to include 100 values, up to the maximum value
    const maxValue = max(data, d => d.outsideTemp) + 1000;
    const yTicks = 100;
    const yAxis = Array(Math.floor(maxValue / yTicks))
      .fill()
      .map((value, index) => (index + 1) * yTicks);

    // variable describing the tooltip
    // the idea is to assign a data point to this variable
    let tooltip = null;
</script>

<style>
    svg {
      width: 100%;
      height: auto;
      display: block;
    }
</style>

<!-- when exiting the article remove the tooltip -->
<article on:mouseout="{() => { tooltip = null; }}">
    <h1>{title}</h1>
    <svg {width} {height} viewBox="0 0 {width + (margin.left + margin.right)} {height + (margin.top + margin.bottom)}">
        <g transform="translate({margin.top} {margin.left})">
            <!-- lines chart using the mask to avoid drawing shapes where the highlighted points rest -->
            <g mask="url(#mask-{title.toLowerCase().split(' ').join('-')})">
                <!-- made-up axes using the dates and values chosen in the Axis variables to draw text and a few lines -->
                <g class="axes">
                    <g transform="translate(0 {height})">
                        <!-- solid dash of the xAxis -->
                        <path fill="none" stroke="hsl(0, 0%, 0%)" stroke-width="0.5" d="M 0 0 h {width}" />
                        {#each xAxis as xTick}
                        <g transform="translate({xScale(xTick)} 0)">
                            <text fill="hsl(0, 0%, 0%)" font-size="3" text-anchor="middle" y="5">{formatTime(xTick)}</text>
                        </g>
                        {/each}
                    </g>
                    {#each yAxis as yTick}
                    <g transform="translate(0 {yScale(yTick)})">
                        <!-- grid lines for the y axis -->
                        <path opacity="0.2" fill="none" stroke="hsl(0, 0%, 0%)" stroke-width="0.5" stroke-dasharray="1" d="M 0 0 h {width}" />
                        <!-- position the text right atop the grid lines -->
                        <text fill="hsl(0, 0%, 0%)" opacity="0.5" font-size="3" text-anchor="start" x="0" y="-1">{yTick}</text>
                    </g>
                    {/each}
                </g>

                <!-- lines chart -->
                <path fill="none" stroke="blue" stroke-width="1" d="{outsideTempLine(data)}" />
                <path fill="none" stroke="red" stroke-width="1" d="{entranceTempLine(data)}" />
                <path fill="none" stroke="green" stroke-width="1" d="{kitchenTempLine(data)}" />
                <path fill="none" stroke="orange" stroke-width="1" d="{couloirTempLine(data)}" />
            </g>

            <!-- tooltip described with a text, circle, and a line connecting the data point vertically to the x axis -->
            {#if tooltip}
            <g fill="currentColor" transform="translate({xScale(parseTime(tooltip.date))} {yScale(tooltip.outsideTemp)})">
                <text text-anchor="middle" font-size="5" font-weight="bold" fill="hsl(0, 0%, 10%)" y="-3">{tooltip.outsideTemp}</text>
                <path opacity="0.75" fill="none" stroke="hsl(0, 0%, 10%)" stroke-width="0.5" stroke-dasharray="1" d="M 0 0 v {height - yScale(tooltip.outsideTemp)}" />
                <circle r="2" fill="hsl(0, 0%, 10%)" />
            </g>
            {/if}
            <!-- rectangles included atop the visualization to manage mouse events  -->
            {#each data as dataPoint, index}
            <g transform="translate({xScale(parseTime(dataPoint.date))} 0)">
                <!-- upon entering the rectangle update the tooltip with the data point behind the respective rectangle -->
                <rect on:mouseenter="{() => {tooltip = data[index]}}" opacity="0" x="-{xScale(parseTime(data[1].date)) / 2}" width="{xScale(parseTime(data[1].date)) - xScale(parseTime(data[0].date))}" {height} />
            </g>
            {/each}
        </g>
    </svg>
</article>
