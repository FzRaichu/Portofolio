export const CHAPTERS = [
  { id: "home", label: "Introduction", cue: "A point of departure" },
  { id: "about", label: "About", cue: "A little closer" },
  { id: "skills", label: "Skills", cue: "Connecting the dots" },
  { id: "projects", label: "Projects", cue: "Ideas taking shape" },
  { id: "contact", label: "Contact", cue: "The next conversation" },
] as const;

// Use actual chapter starts: expanded content must not desynchronize the scene.
export function progressAtScroll(scroll: number, starts: readonly number[]) {
  if (starts.length < 2 || scroll <= starts[0]) return 0;
  for (let i = 0; i < starts.length - 1; i++) {
    if (scroll < starts[i + 1])
      return (
        (i + (scroll - starts[i]) / Math.max(1, starts[i + 1] - starts[i])) /
        (starts.length - 1)
      );
  }
  return 1;
}

const STOPS = [
  { x: 2.5, y: 0.15, z: 8.4, scale: 1, rx: 0.35, ry: 0, rz: -0.25, energy: 1 },
  {
    x: -2.8,
    y: 0.1,
    z: 8.8,
    scale: 0.9,
    rx: 1.1,
    ry: 1.5,
    rz: 0.4,
    energy: 0.8,
  },
  {
    x: 2.7,
    y: 0.2,
    z: 9.2,
    scale: 1.05,
    rx: 0.5,
    ry: 3.1,
    rz: -0.4,
    energy: 0.85,
  },
  {
    x: 0.5,
    y: 1.5,
    z: 12,
    scale: 1.7,
    rx: 1.3,
    ry: 4.6,
    rz: 0.1,
    energy: 0.16,
  },
  {
    x: -2.5,
    y: 0.2,
    z: 9.8,
    scale: 0.8,
    rx: 0.2,
    ry: 6.3,
    rz: 0.6,
    energy: 0.055,
  },
] as const;
export function sceneAtProgress(progress: number) {
  const position = Math.max(0, Math.min(1, progress)) * (STOPS.length - 1);
  const index = Math.min(Math.floor(position), STOPS.length - 2);
  const t = position - index;
  const smooth = t * t * (3 - 2 * t);
  const a = STOPS[index];
  const b = STOPS[index + 1];
  const mix = (key: keyof typeof a) => a[key] + (b[key] - a[key]) * smooth;
  return {
    x: mix("x"),
    y: mix("y"),
    z: mix("z"),
    scale: mix("scale"),
    rx: mix("rx"),
    ry: mix("ry"),
    rz: mix("rz"),
    energy: mix("energy"),
  };
}
