import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { getCookie } from "@workspace/ui/lib/cookies";
import { AlertTriangle, ArrowLeft, RefreshCcw, RotateCcw } from "lucide-react";
import { useEffect } from "react";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown application error";
}

export function RouteErrorBoundary({ error, reset }: ErrorComponentProps) {
  useEffect(() => {
    console.error("Route rendering failed:", error);
  }, [error]);

  return (
    <main className="grid min-h-svh place-items-center bg-background p-6">
      <Card className="w-full max-w-lg overflow-hidden">
        <div className="h-1 bg-destructive" />
        <CardHeader>
          <div className="mb-3 grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle />
          </div>
          <CardTitle className="type-title">页面暂时无法显示</CardTitle>
          <CardDescription className="max-w-md leading-relaxed">
            页面渲染过程中发生异常。你可以先重试当前页面；如果问题持续出现，请刷新应用并检查服务状态。
          </CardDescription>
        </CardHeader>
        {import.meta.env.DEV && (
          <CardContent>
            <pre className="max-h-36 overflow-auto whitespace-pre-wrap rounded-lg border bg-surface p-3 font-mono text-destructive text-xs">
              {getErrorMessage(error)}
            </pre>
          </CardContent>
        )}
        <CardFooter className="flex-wrap gap-2 border-t">
          <Button onClick={reset}>
            <RotateCcw />
            重试页面
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCcw />
            刷新应用
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export function NotFoundPage() {
  const target = getCookie("Authorization") ? "/dashboard" : "/";

  return (
    <main className="grid min-h-svh place-items-center bg-background p-6">
      <div className="max-w-lg text-center">
        <p className="type-label text-primary uppercase">404 · Not found</p>
        <h1 className="type-display mt-3">这个页面不存在</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          地址可能已经变更，或者你访问的功能已经被移动到新的管理入口。
        </p>
        <Button asChild className="mt-7">
          <Link to={target as "/dashboard"}>
            <ArrowLeft />
            返回可用页面
          </Link>
        </Button>
      </div>
    </main>
  );
}
