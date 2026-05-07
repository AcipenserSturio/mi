type TrackWeights = { id: number; track: string; weight: number }[];

type EventLayoutInput = {
  track: string;

  // normalized span within track
  // [0,1] = full track
  // [0.5,1] = lower half
  // [0,0.5] = upper half
  span?: [number, number];
};

type ScaleBandConfig = {
  domain: TrackWeights;
  range: [number, number];

  // optional spacing between tracks
  padding?: number;
};

export function scaleBand({ domain, range, padding = 0 }: ScaleBandConfig) {
  const [rangeMin, rangeMax] = range;

  const totalWeight = domain
    .map((entry) => entry.weight)
    .reduce((a, b) => a + b);

  const totalPadding = Math.max(0, domain.length - 1) * padding;

  const usableHeight = rangeMax - rangeMin - totalPadding;

  // Precompute track geometry
  let cursor = rangeMin;

  const tracks = new Map<
    string,
    {
      y: number;
      height: number;
      weight: number;
    }
  >();

  for (const entry of domain) {
    const height = usableHeight * (entry.weight / totalWeight);

    tracks.set(entry.track, {
      y: cursor,
      height,
      weight: entry.weight,
    });

    cursor += height + padding;
  }

  return function layout(event: EventLayoutInput) {
    const event_padding = 1;
    // console.log([...tracks.keys()].includes(event.track));
    const track = tracks.get(event.track);
    // console.log(track);

    if (!track) {
      throw new Error(`Unknown track: ${event.track}`);
    }

    const span = event.span ?? [0, 1];

    const [start, end] = span;

    if (start < 0 || end > 1 || start >= end) {
      throw new Error(`Invalid span for ${event.track}: [${start}, ${end}]`);
    }

    const y = track.y + track.height * start - event_padding;

    const height = track.height * (end - start) - event_padding;

    return {
      track: event.track,
      y,
      height,
      trackY: track.y,
      trackHeight: track.height,
    };
  };
}
