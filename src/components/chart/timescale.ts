type Segment = {
  start: number; // inclusive year
  end: number; // exclusive year
  weight: number; // visual importance multiplier
};

const SEGMENTS: Segment[] = [
  { start: -10000, end: -700, weight: 0.25 },
  { start: -700, end: 300, weight: 0.5 },
  { start: 300, end: 1400, weight: 0.75 },
  { start: 1400, end: 1800, weight: 1 },
  { start: 1800, end: 1900, weight: 2 },
  { start: 1900, end: 3000, weight: 3 },
];

export function createWeightedTimeScale({
  domain,
  range,
}: {
  domain: [number, number];
  range: [number, number];
}) {
  const [minDate, maxDate] = domain;
  const [rangeMin, rangeMax] = range;

  const minTime = minDate;
  const maxTime = maxDate;

  // Clamp segments to domain
  const activeSegments = SEGMENTS.map((s) => {
    const segStart = s.start;
    const segEnd = s.end;

    return {
      ...s,
      startTime: Math.max(segStart, minTime),
      endTime: Math.min(segEnd, maxTime),
    };
  }).filter((s) => s.endTime > s.startTime);

  // Compute weighted total length
  const weightedLengths = activeSegments.map((s) => {
    const duration = s.endTime - s.startTime;
    return duration * s.weight;
  });

  const totalWeighted = weightedLengths.reduce((a, b) => a + b, 0);

  // Precompute cumulative offsets
  let cumulative = 0;

  const enriched = activeSegments.map((s, i) => {
    const weightedLength = weightedLengths[i];

    const result = {
      ...s,
      weightedLength,
      cumulativeStart: cumulative,
    };

    cumulative += weightedLength;

    return result;
  });

  return function scale(date: number): number {
    const t = date;

    // Clamp
    if (t <= minTime) return rangeMin;
    if (t >= maxTime) return rangeMax;

    const seg = enriched.find((s) => t >= s.startTime && t < s.endTime);

    if (!seg) {
      return rangeMin;
    }

    const localProgress = (t - seg.startTime) / (seg.endTime - seg.startTime);

    const weightedPosition =
      seg.cumulativeStart + localProgress * seg.weightedLength;

    const normalized = weightedPosition / totalWeighted;

    return rangeMin + normalized * (rangeMax - rangeMin);
  };
}
