# Vertical templates

Phase 4 validates the design system against three production page types before the remaining admin routes are migrated in batches.

## Operations dashboard

Route: `/dashboard`

- `PageHeader` exposes the operational context and high-frequency destinations.
- Metric cards use semantic roles rather than feature-specific colors.
- Revenue, user, node traffic, and customer traffic charts share card hierarchy, tabs, tooltips, and empty states.
- Visual regression uses representative non-zero data so chart rendering is part of acceptance.

## User operations

Route: `/dashboard/user`

- The primary create action belongs to `PageHeader`; filters and table utilities stay in `FilterBar`.
- Passive account and verification states use `StatusBadge`; switches remain reserved for direct state changes.
- Profile and subscription workflows use `DetailSheet`, preserving table context while editing.
- Loading, retry, tabs, financial fields, notification settings, and authentication methods stay within one detail workflow.

## System settings

Route: `/dashboard/system`

- Settings are grouped by user intent: general, security, and operations.
- A sticky local navigation replaces the previous table-based directory.
- Each group is a descriptive card containing `SettingsEntry` entry points with repository-local Lucide icons.
- Site configuration is the reference long-form workflow and uses `DetailSheet` with a scrollable body and `StickyActions`.

## Batch migration gate

The remaining routes may be migrated only after these checks remain green:

1. Light/comfortable visual snapshots for all three routes.
2. User profile and system site-settings detail-sheet snapshots.
3. Keyboard-visible controls and responsive wrapping at the standard desktop and mobile breakpoints.
4. Existing API paths, mutation behavior, URL filters, and route aliases remain unchanged.
5. Lint, unit tests, TypeScript, production build, and the complete visual suite pass.
