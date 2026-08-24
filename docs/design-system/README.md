# Perfect Panel Design System

This document defines the implementation contract for the admin redesign. The
system is built on shadcn/ui composition patterns, but it is a product-specific
design system rather than a copied dashboard skin.

Open the interactive reference at `/#/ui-lab` during local development.

## Foundations

The canonical token source is
`packages/ui/src/styles/globals.css`. Components must consume semantic tokens;
feature code must not introduce a second color, spacing, density, or animation
scale.

### Theme tokens

The light and dark themes expose the same roles:

| Group | Tokens | Usage |
| --- | --- | --- |
| Canvas | `background`, `foreground` | Page canvas and default text |
| Surfaces | `card`, `popover`, `surface`, `surface-raised`, `surface-muted` | Content and overlay hierarchy |
| Brand | `primary`, `primary-foreground` | Primary actions and current selection |
| Neutral | `secondary`, `muted`, `accent` | Secondary actions, metadata, hover states |
| Status | `success`, `warning`, `info`, `destructive` | Business and system status |
| Controls | `border`, `input`, `ring` | Boundaries, fields, and keyboard focus |

Use status colors together with a label or icon. Color alone must never carry
meaning. New feature-specific colors require a semantic role and a light/dark
pair before they can be used in a page.

### Typography

The system font stack works without a network font request and includes Chinese
system fonts. Five utility roles are available:

| Class | Role |
| --- | --- |
| `type-display` | Dashboard hero numbers or rare high-emphasis statements |
| `type-title` | Page and major section titles |
| `type-heading` | Card and component titles |
| `type-body` | Default product copy |
| `type-label` | Metadata, compact labels, and uppercase categories |

Do not choose a text size independently when one of these roles fits. Tabular
data should add `tabular-nums`; code and identifiers use `font-mono`.

### Density

`DensityProvider` stores the user preference in the `density` cookie and writes
`data-density` to the root document element. The supported values are:

- `compact`: high-volume operations and dense tables.
- `comfortable`: default admin experience.
- `spacious`: lower information density and touch-friendly layouts.

The modes change control height, horizontal padding, form gaps, card padding,
table row height, and page gutters. Components must reference the density
variables instead of branching on the current mode.

```tsx
import { useDensity } from "@workspace/ui/integrations/density";

const { density, setDensity } = useDensity();
setDensity("compact");
```

### Motion

The duration hierarchy is:

| Token | Default | Usage |
| --- | ---: | --- |
| `--motion-duration-instant` | 80ms | Pressed and micro feedback |
| `--motion-duration-fast` | 140ms | Hover, focus, selection |
| `--motion-duration-normal` | 220ms | Popovers and standard transitions |
| `--motion-duration-slow` | 360ms | Important entrance or hierarchy change |

Use `--motion-ease-standard` for state changes and
`--motion-ease-emphasized` for entrances. The reduced-motion media query maps
all durations to `1ms` and movement distances to zero. Feature code must not
override that behavior with fixed durations.

## Component contract

The Phase 1 foundation updates Button, Input, Textarea, Select, Card, Badge,
Alert, Tabs, Table, Dialog, Switch, Checkbox, Label, and Skeleton. Their public
composition APIs remain compatible with existing shadcn usage, while sizes,
focus treatment, elevation, status variants, and transitions now use the shared
tokens.

Rules for feature work:

1. Reuse `@workspace/ui/components/*` before creating a feature component.
2. Compose primitives in the feature package; do not fork a base component to
   change fixed padding or color.
3. Use semantic variants (`success`, `warning`, `destructive`) only for their
   matching state.
4. Keep keyboard focus visible and preserve the primitive's ARIA behavior.
5. Validate the result in light/dark themes and all three densities in UI Lab.

## UI Lab and verification

Run the admin app and open the standalone route:

```bash
bun run dev --filter=ppanel-admin-web
```

```text
http://localhost:5173/#/ui-lab
```

The route intentionally sits outside the current dashboard shell. It allows the
new design system to be evaluated without inheriting legacy layout styles and
remains the reference while feature pages are replaced directly.

Automated checks:

```bash
bun run lint
bun run test
bun run build --filter=ppanel-admin-web
bun x playwright test tests/visual/ui-lab.spec.ts
```

The UI Lab visual test compares light/comfortable and dark/compact full-page
screenshots. Phase 0 route coverage remains the behavior baseline during the
page-by-page migration; its active screenshots are updated only for intentional
design-system changes.
