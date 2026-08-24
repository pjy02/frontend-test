import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

test("visual CI uses pinned Bun and compares committed screenshots", async () => {
  const workflow = await readFile(
    path.join(repoRoot, ".github", "workflows", "visual-regression.yml"),
    "utf8"
  );

  assert.match(workflow, /bun-version:\s*['"]1\.3\.1['"]/);
  assert.match(workflow, /runs-on:\s*windows-latest/);
  assert.match(workflow, /playwright install chromium/);
  assert.match(workflow, /bun run test:visual/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
});
