import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "@workspace/ui/components/sonner";
import { NavigationProgress } from "@workspace/ui/composed/navigation-progress";
import { TanStackQueryDevtools } from "@workspace/ui/integrations/tanstack-query-devtools";
import { isBrowser } from "@workspace/ui/utils/index";
import { useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  NotFoundPage,
  RouteErrorBoundary,
} from "@/components/route-error-boundary";
import { useGlobalStore } from "@/stores/global";
import { fetchInitialConfig } from "@/utils/bootstrap";

function RootComponent() {
  const { common, setCommon } = useGlobalStore();
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const configResponse = await fetchInitialConfig();
        if (configResponse.data?.data) {
          setCommon(configResponse.data.data);
        }
      } catch (error) {
        console.error("Failed to initialize app:", error);
      }
    };

    initializeApp();
  }, []);

  const { site } = common;
  const title = site.site_name || "Loading...";
  const description = site.site_desc || "";
  const keywords = site.keywords || "";
  const logo = site.site_logo || "";
  const url = isBrowser() ? window.location.href : "";

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta content={description} name="description" />
        <meta content={keywords} name="keywords" />
        <link href={url} rel="canonical" />
        <link href={logo} rel="icon" />
        <link href={logo} rel="apple-touch-icon" sizes="180x180" />
        <link href="/site.webmanifest" rel="manifest" />
      </Helmet>
      <NavigationProgress />
      <Outlet />
      <Toaster closeButton richColors />
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </HelmetProvider>
  );
}

export const Route = createRootRouteWithContext()({
  component: RootComponent,
  errorComponent: RouteErrorBoundary,
  notFoundComponent: NotFoundPage,
});
