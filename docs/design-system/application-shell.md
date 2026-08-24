# Admin application shell

Phase 2 replaces the previous dashboard wrapper with one application shell. It
is not a parallel v2 layout and has no runtime fallback to the legacy shell.

## Structure

```text
AdminShell
├── SidebarProvider
│   ├── SidebarLeft
│   │   ├── Product identity
│   │   ├── Primary navigation
│   │   ├── Collapsible navigation groups
│   │   └── UI Lab and collapse controls
│   └── SidebarInset
│       ├── Header
│       │   ├── Sidebar trigger
│       │   ├── Breadcrumb
│       │   ├── Command menu
│       │   └── Locale, timezone, theme, and user actions
│       └── Route outlet
```

The sidebar uses the shadcn sidebar primitives for desktop, collapsed, and
mobile-sheet behavior. Navigation icons come from Lucide and use the current
semantic foreground color; feature pages must not reintroduce multi-color menu
icons.

## Navigation contract

`apps/admin/src/layout/navs.ts` is the canonical navigation source. Sidebar,
breadcrumbs, and the command menu all derive from the same tree. Adding a page
to more than one independent navigation list is prohibited.

Every navigable item requires:

- a translated title;
- an absolute admin route;
- one Lucide icon;
- a parent group when it is not a workspace-level destination.

Active matching is exact for `/dashboard` and prefix-based for nested feature
routes. The current group opens automatically when its child route is active.

## Command menu

Open the command menu with `Ctrl+K` on Windows/Linux or `Command+K` on macOS.
It searches every leaf navigation item and provides direct access to UI Lab.
The component uses the same translated navigation labels as the sidebar.

## Authentication guard

Authentication is enforced in `routes/dashboard/route.tsx` before the protected
layout renders:

1. Check for the authorization cookie.
2. Resolve the current administrator from `/v1/admin/user/current`.
3. Reuse the in-flight session request across simultaneous route work.
4. Remove an invalid credential and redirect to the login route.
5. Store only a validated local redirect path for post-login navigation.

The login route performs the inverse check and redirects an already authenticated
administrator to `/dashboard`. Redirect values reject protocol-relative,
external, and non-path values to prevent open redirects.

## Error handling

The root route owns the route error boundary and not-found component. Rendering
errors offer a local reset and a full application reload. Detailed error text is
shown only in development; production users receive a stable recovery message.

Request errors remain the responsibility of the shared request interceptor.
Authentication failures clear the session and return to the login page.

## Responsive behavior

- Desktop: inset sidebar with persistent expanded/collapsed preference.
- Tablet: compact header actions and collapsible sidebar.
- Mobile: sidebar becomes an off-canvas sheet; breadcrumb shows the current page.
- The command menu remains available as an icon button at every width.

## Verification

```bash
bun run lint
bun run test
bun run build --filter=ppanel-admin-web
bun run test:visual
```

The visual suite covers every existing admin route, the redesigned login page,
the expanded shell, command menu, sidebar collapse behavior, and anonymous
dashboard redirection.
