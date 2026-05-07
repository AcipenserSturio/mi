<script lang="ts">
  import { csvParse } from "d3-dsv";
  import { timeFormat } from "d3-time-format";
  import { createWeightedTimeScale } from "@/components/chart/timescale.ts";
  import { scaleBand } from "@/components/chart/tracks.ts";

  export let width = 600;
  export let height = 400;
  export let csvText = "";
  export let csvTracks = "";
  export let csvColours = "";

  const margin = { top: 40, right: 300, bottom: 40, left: 40 };

  let data = [];
  let tracks = [];
  let xScale, yScale;
  let ticks = [];
  let colours = [];
  // let maxScore = 1;
  // let minScore = 0;

  $: if (csvText) {
    data = csvParse(csvText, (d, i) => ({
      id: i,
      track: d.region,
      // score: +d.score,
      start: +d.start,
      end: +d.end,
      label: d.label,
      colour: d.colour,
      span_start: d.span_start ? +d.span_start : 0,
      span_end: d.span_end ? +d.span_end : 1,
      // desc: d.desc,
    }));
    tracks = csvParse(csvTracks, (d, i) => ({
      id: i,
      track: d.track,
      weight: +d.weight,
    }));
    colours = csvParse(csvColours, (d, i) => ({
      label: d.label,
      hex: d.hex,
    }));
    console.log(colours);

    const minDate = Math.min(...data.map((d) => d.start));
    const maxDate = Math.max(...data.map((d) => d.end));
    // minScore = Math.min(...data.map((d) => d.score));
    // maxScore = Math.max(...data.map((d) => d.score));

    xScale = createWeightedTimeScale({
      domain: [minDate, maxDate],
      range: [margin.left, width - margin.right],
    });

    yScale = scaleBand({
      domain: tracks,
      range: [margin.top, height - margin.bottom],
    });

    ticks = [
      -1600, -1500, -1400, -1300, -1200, -1100, -1000, -900, -800, -700, -600,
      -500, -400, -300, -200, -100, 1, 100, 200, 300, 400, 500, 600, 700, 800,
      900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
    ];
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
        <line y1="0" y2={-height} stroke="#ddd" />
        <line y2="6" stroke="black" />
        <text y="20" text-anchor="middle" font-size="10">
          {Math.abs(t)}
          {t < 0 ? "BC" : t < 1000 ? "AD" : ""}
        </text>
      </g>
    {/each}

    <!-- Events -->
    {#each data as d}
      <g>
        <rect
          x={xScale(d.start)}
          y={yScale({ track: d.track, span: [d.span_start, d.span_end] }).y}
          width={xScale(d.end) - xScale(d.start) - 1}
          height={yScale({ track: d.track, span: [d.span_start, d.span_end] })
            .height}
          fill={colours.find((colour) => colour.label == d.colour)
            ? colours.find((colour) => colour.label == d.colour).hex
            : "#ddd"}
          rx="5"
        />
        <text
          x={xScale(d.start)}
          y={yScale({ track: d.track, span: [d.span_start, d.span_end] }).y +
            20}
          font-size="16"
        >
          <tspan font-weight="bold">{d.label}</tspan>
        </text>
      </g>
    {/each}
  {/if}
</svg>

<style>
  svg {
    font-family: system-ui, sans-serif;
  }
</style>
