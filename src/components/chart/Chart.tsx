import { AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scalePoint, scaleTime } from "@visx/scale";
import { Circle } from "@visx/shape";
import { timeMonth } from "d3-time";
import { timeFormat } from "d3-time-format";
import Papa from "papaparse";
import { useEffect, useState } from "react";

const DATE_START = new Date("2022-06-01");
const DATE_END = new Date("2024-01-01");

const categories = ["VOD", "main"];

const margin = { top: 20, right: 20, bottom: 20, left: 100 };

interface Event {
  date: Date;
  category: string;
  title: string;
  description: string;
}

export function Timeline() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    Papa.parse("events.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const parsed: Event[] = result.data.map((d) => ({
          ...d,
          date: new Date(d.date),
        }));
        setEvents(parsed);
        console.log(result);
      },
    });
  }, []);

  const width = 400;
  const height = 1500;

  const yScale = scaleTime({
    domain: [DATE_START, DATE_END],
    range: [margin.top, height - margin.bottom],
  });

  const xScale = scalePoint({
    domain: categories,
    range: [margin.left, width - margin.right],
    padding: 0.5,
  });

  const months = timeMonth.range(DATE_START, DATE_END);
  const format = timeFormat("%b %Y");

  return (
    <svg width={width} height={height}>
      {/* Time axis */}
      <AxisLeft
        scale={yScale}
        left={margin.left - 10}
        tickValues={months}
        tickFormat={(d) => format(d)}
      />

      {/* Vertical category lines */}
      {categories.map((cat) => {
        const x = xScale(cat);
        return (
          <Group key={cat}>
            <line
              x1={x}
              x2={x}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke="#ccc"
            />
            <text x={x} y={margin.top - 5} textAnchor="middle" fontSize={12}>
              {cat}
            </text>
          </Group>
        );
      })}

      {/* Events */}
      {events.map((event, i) => {
        const x = xScale(event.category);
        const y = yScale(event.date);

        if (!x || !y) return null;

        return (
          <Circle key={i} cx={x} cy={y} r={5} fill="steelblue">
            <title>{`${event.title}\n${event.description}`}</title>
          </Circle>
        );
      })}
    </svg>
  );
}
