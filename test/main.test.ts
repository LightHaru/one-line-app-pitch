import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { ENTRY, main } from "../main.ts";

const mainPath = join(dirname(fileURLToPath(import.meta.url)), "..", "main.ts");

function tempDir(t: import("node:test").TestContext): string {
  const dir = mkdtempSync(join(tmpdir(), "one-line-pitch-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test("writes the same bytes on every run", (t) => {
  const a = tempDir(t);
  const b = tempDir(t);
  main(a);
  main(b);
  const first = readFileSync(join(a, "entry.txt"));
  const second = readFileSync(join(b, "entry.txt"));
  assert.deepEqual(first, second);
});

test("entry is a strict single line with no trailing newline", (t) => {
  const dir = tempDir(t);
  const file = main(dir);
  const text = readFileSync(file, "utf8");
  assert.ok(text.length > 0);
  assert.ok(!text.includes("\n") && !text.includes("\r"));
  assert.equal(text.trim(), text);
});

test("entry is exactly one complete sentence", () => {
  const terminators = ENTRY.match(/[.!?](?=\s|$)/g) ?? [];
  assert.equal(terminators.length, 1);
  assert.match(ENTRY, /[.!?]$/);
});

test("entry is at most 240 Unicode characters", () => {
  assert.ok([...ENTRY].length <= 240);
});

test("CLI writes entry.txt inside the directory argument", (t) => {
  const dir = tempDir(t);
  execFileSync(process.execPath, [mainPath, dir]);
  assert.equal(readFileSync(join(dir, "entry.txt"), "utf8"), ENTRY);
});
