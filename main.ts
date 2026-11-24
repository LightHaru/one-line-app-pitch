import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ENTRY =
  "You've told me a dozen times someone should make that trip-expense app — tell it once to an AI agent on make.fun and you could be testing your own first version this weekend.";

export function outputDir(args: string[] = process.argv.slice(2)): string {
  return resolve(args[0] ?? "/output");
}

export function main(dir: string = outputDir()): string {
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "entry.txt");
  writeFileSync(file, ENTRY, { encoding: "utf8" });
  return file;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}
