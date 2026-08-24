# Page patterns

Phase 3 defines the reusable page-level patterns used by every admin feature. These patterns sit above the shadcn primitives and below business modules.

## Composition contract

Use the following order for list and management pages:

1. `PageHeader` owns the page title, context, metadata, and primary action.
2. `FilterBar` owns search, filters, reset behavior, and table utilities.
3. `DataTable` owns the bordered data surface and loading, empty, and error rows.
4. `DetailSheet` keeps create, edit, and inspect workflows in the current page context.
5. `FormSection` groups fields by user intent instead of API object shape.
6. `StickyActions` keeps cancel and submit controls reachable in long forms.

`StatusBadge` is the only standard for passive business status. Switches and checkboxes remain reserved for interactive state changes.

## Components

| Pattern | Import | Responsibility |
| --- | --- | --- |
| Page header | `@workspace/ui/composed/page-header` | Title hierarchy, supporting copy, metadata, primary actions |
| Data table | `@workspace/ui/composed/data-table` | Consistent table surface and asynchronous rows |
| Filter bar | `@workspace/ui/composed/filter-bar` | Search, structured filters, reset and table tools |
| Detail sheet | `@workspace/ui/composed/detail-sheet` | Responsive side panel with fixed header and scrollable body |
| Status badge | `@workspace/ui/composed/status-badge` | Neutral, success, warning, info, and destructive states |
| Form section | `@workspace/ui/composed/form-section` | Intent-based field groups with local guidance |
| Sticky actions | `@workspace/ui/composed/sticky-actions` | Persistent form actions and save guidance |
| Async states | `@workspace/ui/composed/async-state` | Loading skeleton, empty guidance, retryable error |

## Data tables

`ProTable` remains the request-aware table used by existing modules. It now composes `FilterBar` and `DataTable`, so all current list pages receive the Phase 3 surface and asynchronous-state behavior without changing their service contracts.

New pages should pass localized empty and error copy when the generic message is not sufficient. Loading states preserve the table shape, while refreshes keep existing rows visible beneath a lightweight loading layer.

## Detail and form rules

- Use `sm`, `md`, or `lg` sheet sizes based on field complexity; do not add arbitrary widths in feature modules.
- Keep destructive actions visually separated from the primary save action.
- Use one `FormSection` per user decision area.
- The sticky footer must include a cancel path and may include concise save or validation guidance.
- On mobile, actions wrap and remain reachable without horizontal scrolling.

## Reference implementation

The announcement module is the first production integration. UI Lab contains the complete reference state matrix, including responsive headers, filters, data rows, status badges, a detail form, loading, empty, and error states.
