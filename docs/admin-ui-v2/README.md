# Admin UI v2 - Phase 0

Phase 0 freezes the current admin UI as a measurable baseline before the
shadcn/ui redesign starts. It does not publish a package or create a release;
Vercel remains responsible for deployment.

## Toolchain and CI

- Bun is pinned to `1.3.1` in `package.json` and both CI workflows.
- `.github/workflows/ci.yml` runs lint, unit tests, automation contract tests,
  and the admin production build. It contains no release or publishing step.
- `.github/workflows/visual-regression.yml` installs Chromium and compares all
  committed admin screenshots. On failure it uploads the HTML report, actual
  image, and diff image for 14 days.

## Route and API inventory

Run:

```bash
bun run baseline:admin
```

The committed output is `phase-0-baseline.md`. The scanner follows every admin
TanStack route through its local imports, then records reachable generated
service functions, operation types, and `/v1` endpoints. Runtime-only dynamic
imports and backend-dependent conditional actions still need verification
against a real backend during the page-by-page redesign.

## Visual baseline

Install the browser once, then compare the current UI with the committed
baseline:

```bash
bun x playwright install chromium
bun run test:visual
```

The suite covers 30 routes at a fixed `1440x900` viewport with the Chinese
locale, reduced motion, disabled CSS transitions, deterministic randomness,
and stable API fixtures. It also rejects React error-boundary pages.

Screenshots live under:

```text
tests/visual/__screenshots__/desktop-chromium/admin-baseline.spec.ts/
```

Only accept an intentional visual change with:

```bash
bun run test:visual:update
```

Review the changed PNG files before committing them. These screenshots use API
fixtures and are a visual contract, not proof that a real backend operation
succeeds.

## Admin UI v2 switch

`VITE_ADMIN_UI_V2` selects the layout boundary used by the dashboard route:

```env
VITE_ADMIN_UI_V2=false
```

- `false` or unset: current admin shell.
- `true` or `1`: `AdminShellV2` migration boundary.

The v2 boundary intentionally delegates to the current shell in Phase 0, so
turning it on is safe before redesign work begins. Future phases replace the
implementation behind this boundary. Since the final product does not need to
retain the old UI, remove the old shell and this temporary switch after the v2
route set reaches functional and visual parity.

For Vercel, add `VITE_ADMIN_UI_V2` to the admin project's environment variables
and redeploy when a preview of the new shell is needed.

## Local verification

```bash
bun install --frozen-lockfile
bun run lint
bun run test
bun run test:automation
bun run build --filter=ppanel-admin-web
bun run test:visual
```
