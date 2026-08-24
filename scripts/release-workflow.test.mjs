import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflowUrl = new URL("../.github/workflows/ci.yml", import.meta.url);

test("CI workflow is pinned and validates automation changes", async () => {
  const workflow = await readFile(workflowUrl, "utf8");

  for (const ignoredPath of [
    "docs/**",
    "packages/ui/openapi2ts.config.ts",
    "packages/ui/openapi-templates/**",
  ]) {
    assert.match(
      workflow,
      new RegExp(`['"]${ignoredPath.replaceAll("*", "\\*")}['"]`),
      `release workflow must ignore ${ignoredPath}`
    );
  }

  assert.doesNotMatch(workflow, /['"]\.github\/\*\*['"]/);
  assert.doesNotMatch(workflow, /['"]scripts\/\*\*['"]/);

  assert.match(workflow, /uses:\s*actions\/cache@v4/);
  assert.doesNotMatch(workflow, /uses:\s*actions\/cache@v3/);
  assert.match(workflow, /uses:\s*oven-sh\/setup-bun@v2/);
  assert.match(workflow, /bun-version:\s*['"]?1\.3\.1['"]?/);
  assert.match(workflow, /bun install --frozen-lockfile/);
  assert.match(workflow, /bun run lint/);
  assert.match(workflow, /bun run test/);
  assert.match(workflow, /bun run test:automation/);
  assert.match(workflow, /bun run build --filter=ppanel-admin-web/);
  assert.doesNotMatch(workflow, /bun run release/);
});
