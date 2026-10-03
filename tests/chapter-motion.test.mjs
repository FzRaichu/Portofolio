import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const exports = {};
vm.runInNewContext(
  ts.transpileModule(
    fs.readFileSync(
      new URL("../src/lib/chapter-motion.ts", import.meta.url),
      "utf8",
    ),
    {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    },
  ).outputText,
  { exports },
);
const { chapterMotion } = exports;

test("tall chapters hold a neutral reading pose while their content is in view", () => {
  for (const top of [80, 0, -400, -1000]) {
    const pose = chapterMotion(top, 2000, 900, 3);
    assert.equal(pose.enter, 0);
    assert.equal(pose.exit, 0);
    assert.equal(pose.scale, 1);
    assert.equal(pose.opacity, 1);
  }
});

test("chapter transitions reverse deterministically and use distinct directions", () => {
  const arriving = chapterMotion(500, 900, 900, 1);
  const leaving = chapterMotion(-500, 900, 900, 1);
  assert.ok(arriving.x > 0 && leaving.x < 0);
  assert.ok(chapterMotion(500, 900, 900, 2).x < 0);
  assert.deepEqual(chapterMotion(500, 900, 900, 1), arriving);
});

test("compact motion is gentler and all overscroll transforms stay bounded", () => {
  const desktop = chapterMotion(500, 900, 900, 1);
  const mobile = chapterMotion(500, 900, 900, 1, true);
  assert.ok(Math.abs(mobile.x) < Math.abs(desktop.x));
  assert.ok(mobile.opacity > desktop.opacity);
  for (const top of [-100000, -900, 0, 900, 100000]) {
    const pose = chapterMotion(top, 900, 900, 0);
    assert.ok(Object.values(pose).every(Number.isFinite));
    assert.ok(pose.scale >= 0.88 && pose.scale <= 1);
    assert.ok(pose.opacity >= 0.28 && pose.opacity <= 1);
  }
});
