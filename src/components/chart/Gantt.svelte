<script lang="ts">
  import { scaleTime, scaleBand } from "@visx/scale";
  import { csvParse } from "d3-dsv";
  import { timeMonth, timeWeek } from "d3-time";
  import { timeFormat } from "d3-time-format";

  export let width = 600;
  export let height = 400;
  export let csvText = "";

  const margin = { top: 40, right: 20, bottom: 40, left: 20 };

  let data = [];
  let tracks = [];
  let xScale, yScale;
  let ticks = [];

  $: if (csvText) {
    data = csvParse(csvText, (d, i) => ({
      id: i,
      track: d.track,
      start: new Date(d.start),
      end: new Date(d.end),
      label: d.label,
    }));

    tracks = Array.from(new Set(data.map((d) => d.track)));

    const minDate = new Date(Math.min(...data.map((d) => d.start)));
    const maxDate = new Date(Math.max(...data.map((d) => d.end)));

    xScale = scaleTime({
      domain: [minDate, maxDate],
      range: [margin.left, width - margin.right],
    });

    yScale = scaleBand({
      domain: tracks,
      range: [margin.top, height - margin.bottom],
      padding: 0.4,
    });

    ticks = xScale.ticks(timeMonth.every(1));
  }

  const formatMonth = timeFormat("%b %Y");
  // const formatMonth = timeFormat("%b %W");
</script>

<svg {width} {height}>
  {#if xScale && yScale}
    <!-- Axis line -->
    <line
      x1={margin.left}
      x2={width - margin.right}
      y1={height - margin.bottom}
      y2={height - margin.bottom}
      stroke="black"
    />

    <!-- Ticks -->
    {#each ticks as t}
      <g transform={`translate(${xScale(t)}, ${height - margin.bottom})`}>
        <line y2="6" stroke="black" />
        <text y="20" text-anchor="middle" font-size="10">
          {formatMonth(t)}
        </text>
      </g>
    {/each}

    <!-- Events -->
    {#each data as d}
      <g>
        <rect
          x={xScale(d.start)}
          y={yScale(d.track)}
          width={xScale(d.end) - xScale(d.start)}
          height="15"
          fill="#4f46e5"
          rx="3"
        />

        <text x={xScale(d.start)} y={yScale(d.track) - 6} font-size="14">
          {d.label}
        </text>
      </g>
    {/each}
  {/if}
</svg>

<style>
  svg {
    font-family: system-ui, sans-serif;
  }

  text {
    pointer-events: none;
  }
</style>
