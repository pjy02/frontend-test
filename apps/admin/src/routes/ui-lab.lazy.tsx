import { createLazyFileRoute } from "@tanstack/react-router";
import UiLab from "@/sections/ui-lab";

export const Route = createLazyFileRoute("/ui-lab")({
  component: UiLab,
});
