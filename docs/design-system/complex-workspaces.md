# Complex workspaces

Phase 6 applies the design system to workflows that combine dependent data,
multi-section editors, runtime state, and destructive lifecycle actions. API
paths, sorting, copying, enablement defaults, and confirmation rules remain
unchanged.

## Workspace hierarchy

Every complex route starts with `PageHeader`. The header owns the route purpose,
operational metadata, and primary create or lifecycle action. Tables no longer
duplicate the page title or primary action.

- Servers combine global runtime configuration, dynamic traffic multipliers,
  telemetry, protocol listeners, installation, and per-server overrides.
- Nodes expose public endpoints mapped to an enabled server protocol. New and
  copied nodes remain disabled until an operator explicitly enables them.
- Subscription delivery separates global delivery defaults from client
  detection, templates, platform links, and rendered preview.
- Products compose presentation, pricing, quotas, inventory, and eligible node
  groups in one three-part editor. New and copied products remain hidden and
  unavailable for sale.
- Authentication groups communication, social, and device channels with a
  stable anchor navigation and one configuration surface per provider.
- Plugins separate package upload from runtime inspection and retain explicit
  confirmation for disable, restart, and reload-all operations.

## Editor contract

Primary multi-section editors use `DetailSheet` and `StickyActions`. The title
and consequence are visible before fields, the body owns scrolling, and save or
cancel actions remain reachable at every viewport height. Focused package upload
and install-script copying remain modal dialogs because they are short,
self-contained tasks.

Repository-local Lucide icons are required throughout these routes. Runtime
pages and visual tests must never depend on an external icon request.

## Data and state contract

Operational state must be shown as text plus a semantic badge or indicator.
Mutable availability uses `Switch`; passive runtime health uses a badge and
telemetry. Server deletion remains unavailable while nodes reference it.
Destructive plugin and record lifecycle changes keep explicit confirmation.

## Acceptance gate

Phase 6 is accepted only when all six routes render representative records,
their primary create, configuration, or runtime-detail workflows have committed
interaction snapshots, TypeScript and lint pass, existing unit and automation
tests pass, the admin production build succeeds, and the full route visual suite
passes without unintended differences.
