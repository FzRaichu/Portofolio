const clamp = (value: number) => Math.max(0, Math.min(1, value));

// Physical viewport progress, independent of chapter height. Long chapters hold
// their reading pose until the last viewport of content begins to leave.
export function chapterMotion(
  top: number,
  height: number,
  viewport: number,
  index: number,
  compact = false,
) {
  const view = Math.max(1, viewport);
  const enter = clamp((top - view * 0.16) / (view * 0.84));
  const exit = clamp(
    (-top - Math.max(0, height - view) - view * 0.12) / (view * 0.78),
  );
  const arrival = enter * enter * (3 - 2 * enter);
  const departure = exit * exit * (3 - 2 * exit);
  const strength = compact ? 0.32 : 1;
  const direction = [1, 1, -1, 1, -1][index] ?? 1;
  const travel = arrival + departure;
  return {
    enter: arrival,
    exit: departure,
    x: (arrival * direction * 240 - departure * direction * 180) * strength,
    y: (departure * view * 0.38 - arrival * view * 0.18) * strength,
    depth: -travel * (index === 0 ? 340 : 200) * strength,
    turn: (arrival * -direction * 16 + departure * direction * 12) * strength,
    tilt: (arrival * 7 - departure * 6) * strength,
    scale: 1 - travel * 0.12 * strength,
    opacity: 1 - travel * (compact ? 0.35 : 0.72),
  };
}
