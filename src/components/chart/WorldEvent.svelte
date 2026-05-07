<script lang="ts">
  type data = {
    id: number;
    track: string;
    start: number;
    end: number;
    label: string;
    colour: string;
  };
  export let d: data | undefined = {};
  export let xScale, yScale;
  export let colours = [];
  export let tracks = [];
  export let subregions = [];

  function y() {
    let span = [0, 1];
    let track = d!.track;
    let subregion = subregions?.find(
      (subregion) => subregion.subregion == d?.track,
    );
    if (subregion) {
      span = [subregion.span_start, subregion.span_end];
      track = subregion.parent;
    }
    return { track, span };
  }
</script>

{#if d}
  <g>
    <rect
      x={xScale(d.start)}
      y={yScale(y()).y}
      width={xScale(d.end) - xScale(d.start)}
      height={yScale(y()).height}
      fill={colours.find((colour) => colour.label == d.colour)
        ? colours.find((colour) => colour.label == d.colour).hex
        : "#ddd"}
      rx="5"
      opacity="0.9"
    />
    <text x={xScale(d.start)} y={yScale(y()).y + 20} font-size="16">
      <tspan font-weight="bold">{d.label}</tspan>
    </text>
  </g>
{/if}
