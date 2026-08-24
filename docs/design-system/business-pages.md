# Business pages

Phase 5 applies the vertical templates to the routine operational routes without changing their APIs, URL filters, mutations, or confirmation rules.

## List workspace contract

Orders, coupons, announcements, documents, tickets, and payment methods use the same hierarchy:

1. `PageHeader` states the business purpose, primary action, and operational guidance.
2. `FilterBar` owns query controls and table utilities.
3. `DataTable` owns selection, status, row actions, pagination, and empty/error states.
4. Mutable boolean state uses `Switch`; passive state uses `StatusBadge`.
5. Destructive actions keep an explicit confirmation step.

Create actions belong in `PageHeader`. They must not be duplicated in the table toolbar.

## Detail workflows

- Coupon, announcement, document, and payment editors use `DetailSheet` with `StickyActions`.
- Marketing broadcast forms use `DetailSheet`; task managers use a wide read-oriented `DetailSheet`.
- Ticket conversations use a wide `DetailSheet` with automatic refresh, chronological messages, image compression, and a persistent reply composer.
- Closing a ticket remains destructive and requires confirmation.

## Marketing directory

Marketing is a two-card action directory instead of a table used for layout. Email and quota operations use repository-local Lucide icons through `SettingsEntry`, so the page never depends on an external icon request.

## Acceptance gate

Phase 5 is accepted only when representative records render for all seven routes, the five create/detail workflows have committed interaction snapshots, API paths and mutations remain unchanged, and the complete lint, unit, automation, build, and visual suites pass.
