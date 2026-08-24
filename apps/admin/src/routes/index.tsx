import { createFileRoute } from "@tanstack/react-router";
import { redirectAuthenticatedAdmin } from "@/utils/auth-session";

export const Route = createFileRoute("/")({
  beforeLoad: redirectAuthenticatedAdmin,
});
