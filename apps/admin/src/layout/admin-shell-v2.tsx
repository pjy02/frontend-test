import DashboardLayout from "./index";

/**
 * Admin UI v2 migration boundary.
 *
 * Phase 0 deliberately delegates to the current layout. Future phases replace
 * the implementation behind this boundary while VITE_ADMIN_UI_V2 controls
 * whether the new shell is active.
 */
export default function AdminShellV2() {
  return (
    <div className="contents" data-admin-ui-version="v2">
      <DashboardLayout />
    </div>
  );
}
