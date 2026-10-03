import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const exports = {};
const source = fs.readFileSync(
  new URL("../src/lib/journey.ts", import.meta.url),
  "utf8",
);
vm.runInNewContext(
  ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  { exports },
);
const { progressAtScroll, sceneAtProgress } = exports;

test("expanded chapters preserve the scene's chapter alignment", () => {
  const starts = [0, 700, 1900, 2600, 4500];
  starts.forEach((start, index) =>
    assert.equal(progressAtScroll(start, starts), index / 4),
  );
  assert.equal(progressAtScroll(3550, starts), 0.875);
  // A longer project grid changes physical distance, not contact's scene endpoint.
  assert.equal(progressAtScroll(6200, [0, 700, 1900, 2600, 6200]), 1);
});

test("overscroll and not-yet-measured layouts produce bounded progress", () => {
  assert.equal(progressAtScroll(-90, [0, 800]), 0);
  assert.equal(progressAtScroll(1200, [0, 800]), 1);
  assert.equal(progressAtScroll(200, []), 0);
  assert.equal(progressAtScroll(200, [0]), 0);
});

test("camera and sculpture remain continuous at chapter boundaries", () => {
  for (const boundary of [0.25, 0.5, 0.75]) {
    const left = sceneAtProgress(boundary - 0.00001);
    const right = sceneAtProgress(boundary + 0.00001);
    for (const key of Object.keys(left))
      assert.ok(
        Math.abs(left[key] - right[key]) < 0.001,
        key + " jumps at " + boundary,
      );
  }
  for (const progress of [-1, 0, 0.1, 0.25, 0.7, 1, 2]) {
    const pose = sceneAtProgress(progress);
    assert.ok(Object.values(pose).every(Number.isFinite));
    assert.ok(pose.z > 0 && pose.scale > 0);
  }
});
