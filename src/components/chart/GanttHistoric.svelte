<script lang="ts">
  import { scaleTime, scaleBand } from "@visx/scale";
  import { csvParse } from "d3-dsv";
  import { interpolateViridis } from "d3-scale-chromatic";
  import { timeMonth, timeWeek } from "d3-time";
  import { timeFormat } from "d3-time-format";

  export let width = 600;
  export let height = 400;
  export let csvText = "";

  const margin = { top: 40, right: 300, bottom: 40, left: 40 };

  let data = [];
  let tracks = [];
  let xScale, yScale;
  let ticks = [];
  let maxScore = 1;
  let minScore = 0;

  $: if (csvText) {
    data = csvParse(csvText, (d, i) => ({
      id: i,
      track: d.track,
      score: +d.score,
      start: +d.start,
      end: d.end == "ALIVE" ? 2026 : +d.end,
      label: d.label,
      desc: d.desc,
    }))
      .filter((row) => row.end && row.start)
      .filter((row) => row.start >= -700);
    // .filter((row) => row.score > 150)
    // .filter((row) => row.score - ((row.start + row.end) / 2 - 1700) / 5 > 110)
    // .filter(
    //   (row) =>
    //     row.end < 1700 ||
    //     (row.end < 1800 && row.score > 100) ||
    //     (row.end < 1900 && row.score > 120) ||
    //     (row.end < 2000 && row.score > 150) ||
    //     row.score > 160,
    // )
    // .sort((a, b) => a.start > b.start)
    // .sort((a, b) => a.end > b.end);
    // .sort((a, b) => a.start + a.end > b.start + b.end);

    tracks = Array.from(new Set(data.map((d) => d.track)));

    const minDate = Math.min(...data.map((d) => d.start));
    const maxDate = Math.max(...data.map((d) => d.end));
    minScore = Math.min(...data.map((d) => d.score));
    maxScore = Math.max(...data.map((d) => d.score));

    xScale = scaleTime({
      domain: [minDate, maxDate],
      range: [margin.left, width - margin.right],
    });

    yScale = scaleBand({
      domain: tracks,
      range: [margin.top, height - margin.bottom],
      padding: 0.4,
    });

    ticks = [
      -700, -600, -500, -400, -300, -200, -100, 1, 100, 200, 300, 400, 500, 600,
      700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900,
      2000,
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
          y={yScale(d.track)}
          width={xScale(d.end) - xScale(d.start)}
          height="7"
          fill={interpolateViridis(
            1 - (d.score - minScore) / (maxScore - minScore),
          )}
          rx="3"
        />

        <a
          target="_blank"
          href={`https://en.wikipedia.org/wiki/${d.label.replace(" ", "_")}`}
          ><text x={xScale(d.start)} y={yScale(d.track) - 4} font-size="16">
            <tspan font-weight="bold">{d.label}</tspan><tspan font-size="10"
              >, {d.desc.replaceAll(/ ?\(.*?\)/g, "")}</tspan
            >
          </text></a
        >
      </g>
    {/each}
  {/if}
</svg>

<style>
  svg {
    font-family: system-ui, sans-serif;
  }
</style>
