import { createFileRoute } from "@tanstack/react-router";
import { requireAdminAuth } from "@/utils/auth-session";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => requireAdminAuth(location.href),
});
