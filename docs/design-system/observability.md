# Logs and observability

Phase 7 unifies operational logs and the dashboard without changing existing
routes, API paths, query parameters, or event fields.

## Log workspace contract

All twelve log routes use `LogTable`. The shared workspace owns `PageHeader`,
filter and column controls, manual refresh, an operator-selectable 15, 30, or 60
second refresh interval, the last successful update time, and a generic
`DetailSheet` for the complete event payload.

Each route continues to own its domain columns and request mapping. Login and
registration events keep identity and IP context; message events keep delivery
status and content; commercial events keep amounts and order links; traffic
events keep byte formatting and drill-down links. Hidden browser tabs do not
poll, and every interval is cleared when its route unmounts.

## Event detail contract

The table shows fields needed for scanning. The detail sheet exposes every
field returned by the API, including nested objects, so adding a backend event
field does not require a second detail implementation. Existing domain links
and row actions are merged with the detail action rather than replaced.

## Dashboard integration

The dashboard treats server health, online users, pending tickets, revenue,
user activity, and traffic rankings as one operational snapshot. The four
console queries share a 30-second refresh cadence and a single manual refresh
action. The header exposes the cadence and a direct entry into observability.

## Acceptance gate

Phase 7 is accepted when all log routes render representative records, filters
remain mapped to their original API parameters, refresh controls and record
detail are interaction-tested, the dashboard console requests refresh together,
and TypeScript, lint, unit, automation, production build, and visual regression
checks pass.
