import { Link } from "@tanstack/react-router";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Switch } from "@workspace/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  DENSITIES,
  type Density,
  useDensity,
} from "@workspace/ui/integrations/density";
import { useTheme } from "@workspace/ui/integrations/theme";
import {
  Activity,
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  CircleAlert,
  Info,
  Moon,
  Palette,
  Play,
  Search,
  Settings2,
  Sparkles,
  Sun,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";

const themes = [
  { icon: Sun, label: "浅色", value: "light" },
  { icon: Moon, label: "深色", value: "dark" },
  { icon: Settings2, label: "跟随系统", value: "system" },
] as const;

const densityLabels: Record<Density, string> = {
  compact: "紧凑",
  comfortable: "标准",
  spacious: "宽松",
};

const colors = [
  { className: "bg-primary", label: "Primary", token: "--primary" },
  { className: "bg-success", label: "Success", token: "--success" },
  { className: "bg-warning", label: "Warning", token: "--warning" },
  { className: "bg-destructive", label: "Destructive", token: "--destructive" },
  { className: "bg-info", label: "Info", token: "--info" },
  { className: "bg-muted", label: "Muted", token: "--muted" },
] as const;

const tokenGroups = [
  {
    label: "Control",
    tokens: ["--control-height", "--control-padding-x"],
  },
  { label: "Layout", tokens: ["--card-padding", "--table-row-height"] },
  {
    label: "Motion",
    tokens: ["--motion-duration-fast", "--motion-ease-standard"],
  },
] as const;

function LabSection({
  children,
  description,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="grid gap-5 border-t pt-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <div>
        <p className="type-label mb-2 text-primary uppercase">{eyebrow}</p>
        <h2 className="type-title">{title}</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function PreferenceControls() {
  const { density, setDensity } = useDensity();
  const { resolvedTheme, setTheme, theme } = useTheme();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>外观主题</CardTitle>
          <CardDescription>
            当前解析为 {resolvedTheme === "dark" ? "深色" : "浅色"}模式
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2">
          {themes.map((option) => {
            const Icon = option.icon;
            const selected = theme === option.value;
            return (
              <Button
                aria-pressed={selected}
                className="flex-col gap-1.5"
                key={option.value}
                onClick={() => setTheme(option.value)}
                size="lg"
                variant={selected ? "default" : "outline"}
              >
                <Icon />
                <span className="text-xs">{option.label}</span>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>界面密度</CardTitle>
          <CardDescription>
            同一套组件随密度 Token 自动重排，不维护多份样式
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2">
          {DENSITIES.map((option) => (
            <Button
              aria-pressed={density === option}
              key={option}
              onClick={() => setDensity(option)}
              variant={density === option ? "default" : "outline"}
            >
              {density === option && <Check />}
              {densityLabels[option]}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function TokenOverview() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle>语义颜色</CardTitle>
          <CardDescription>
            页面只引用角色名；明暗主题在底层完成颜色映射。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {colors.map((color) => (
            <div className="rounded-lg border bg-surface p-3" key={color.token}>
              <div className={`mb-3 h-16 rounded-md ${color.className}`} />
              <p className="font-medium">{color.label}</p>
              <code className="font-mono text-muted-foreground text-xs">
                {color.token}
              </code>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>系统变量</CardTitle>
          <CardDescription>布局与动效使用同一套命名尺度。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {tokenGroups.map((group) => (
            <div
              className="rounded-lg border bg-surface px-4 py-3"
              key={group.label}
            >
              <p className="type-label mb-2 text-muted-foreground uppercase">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.tokens.map((token) => (
                  <code
                    className="rounded-md bg-surface-muted px-2 py-1 font-mono text-xs"
                    key={token}
                  >
                    {token}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function TypographyPreview() {
  return (
    <Card>
      <CardContent className="grid gap-7">
        <div className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
          <code className="font-mono text-muted-foreground text-xs">
            Display
          </code>
          <p className="type-display">精确、清晰、有层次</p>
        </div>
        <Separator />
        <div className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
          <code className="font-mono text-muted-foreground text-xs">Title</code>
          <p className="type-title">管理复杂系统，也应该从容。</p>
        </div>
        <Separator />
        <div className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
          <code className="font-mono text-muted-foreground text-xs">
            Heading
          </code>
          <p className="type-heading">今日服务概览</p>
        </div>
        <Separator />
        <div className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
          <code className="font-mono text-muted-foreground text-xs">Body</code>
          <p className="type-body max-w-2xl text-muted-foreground">
            正文以 14px
            为默认尺寸，通过更充足的行高保持长列表、配置说明与帮助文本的阅读效率。
          </p>
        </div>
        <Separator />
        <div className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
          <code className="font-mono text-muted-foreground text-xs">Label</code>
          <p className="type-label uppercase">Active subscriptions · 1,284</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ComponentPreview() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Actions & status</CardTitle>
          <CardDescription>动作层级与业务状态使用不同语义。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="flex flex-wrap gap-2">
            <Button>保存更改</Button>
            <Button variant="secondary">次要操作</Button>
            <Button variant="outline">更多选项</Button>
            <Button variant="soft">柔和强调</Button>
            <Button variant="ghost">幽灵按钮</Button>
            <Button variant="destructive">删除</Button>
            <Button disabled>不可用</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button aria-label="Notifications" size="icon" variant="outline">
              <Bell />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>默认</Badge>
            <Badge variant="secondary">草稿</Badge>
            <Badge variant="success">运行中</Badge>
            <Badge variant="warning">待处理</Badge>
            <Badge variant="info">同步中</Badge>
            <Badge variant="destructive">异常</Badge>
            <Badge variant="outline">已归档</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Form controls</CardTitle>
            <CardDescription>表单控件共享高度、间距与焦点环。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-[var(--field-gap)]">
              <Label htmlFor="lab-name">服务名称</Label>
              <Input defaultValue="Hong Kong Edge 01" id="lab-name" />
            </div>
            <div className="grid gap-[var(--field-gap)]">
              <Label htmlFor="lab-search">搜索节点</Label>
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  id="lab-search"
                  placeholder="输入名称或地址"
                />
              </div>
            </div>
            <div className="grid gap-[var(--field-gap)]">
              <Label>地区</Label>
              <Select defaultValue="ap-east">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择地区" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ap-east">Asia Pacific · East</SelectItem>
                  <SelectItem value="eu-west">Europe · West</SelectItem>
                  <SelectItem value="us-west">United States · West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-[var(--field-gap)]">
              <Label htmlFor="lab-note">备注</Label>
              <Textarea id="lab-note" placeholder="添加供团队查看的说明…" />
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-surface px-3 py-2.5">
              <div>
                <Label htmlFor="lab-switch">自动健康检查</Label>
                <p className="mt-1 text-muted-foreground text-xs">
                  每 5 分钟执行一次
                </p>
              </div>
              <Switch defaultChecked id="lab-switch" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox defaultChecked id="lab-checkbox" />
              <Label htmlFor="lab-checkbox">变更后向管理员发送通知</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>
              所有状态都有图标、标题与可读文本。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Alert>
              <CircleAlert />
              <AlertTitle>常规提示</AlertTitle>
              <AlertDescription>配置将在下一次同步时生效。</AlertDescription>
            </Alert>
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>部署成功</AlertTitle>
              <AlertDescription>所有 12 个节点均已更新。</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <TriangleAlert />
              <AlertTitle>需要检查</AlertTitle>
              <AlertDescription>有 2 个节点的证书即将过期。</AlertDescription>
            </Alert>
            <Alert variant="info">
              <Info />
              <AlertTitle>正在同步</AlertTitle>
              <AlertDescription>数据预计在 30 秒内完成更新。</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>连接失败</AlertTitle>
              <AlertDescription>请确认服务地址与访问密钥。</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DataPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>节点状态</CardTitle>
        <CardDescription>表格行高会随当前 Density 自动变化。</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            <Activity />
            刷新
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>节点</TableHead>
              <TableHead>地区</TableHead>
              <TableHead>延迟</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">在线用户</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["Hong Kong Edge 01", "AP East", "24 ms", "运行中", "328"],
              ["Tokyo Core 02", "AP North", "41 ms", "运行中", "196"],
              ["Frankfurt Edge 01", "EU Central", "185 ms", "维护中", "—"],
            ].map((row) => (
              <TableRow key={row[0]}>
                <TableCell className="font-medium">{row[0]}</TableCell>
                <TableCell>{row[1]}</TableCell>
                <TableCell>{row[2]}</TableCell>
                <TableCell>
                  <Badge variant={row[3] === "运行中" ? "success" : "warning"}>
                    {row[3]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row[4]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-between border-t text-muted-foreground text-xs">
        <span>最后更新于 14:32:18</span>
        <span>3 个节点</span>
      </CardFooter>
    </Card>
  );
}

function MotionPreview() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
      <Card>
        <CardHeader>
          <CardTitle>Motion hierarchy</CardTitle>
          <CardDescription>
            快速反馈 140ms，常规过渡 220ms，强调进入
            360ms；系统“减少动态效果”会自动压缩至 1ms。
          </CardDescription>
          <CardAction>
            <Button
              onClick={() => setReplayKey((value) => value + 1)}
              size="sm"
              variant="outline"
            >
              <Play />
              重播
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid min-h-44 place-items-center rounded-xl border bg-surface p-6">
            <div
              className="ui-lab-motion-demo flex max-w-sm items-center gap-3 rounded-xl border bg-card p-4 shadow-[var(--shadow-md)]"
              key={replayKey}
            >
              <div className="grid size-10 place-items-center rounded-lg bg-primary/12 text-primary">
                <Sparkles />
              </div>
              <div>
                <p className="font-medium">动效服务于状态变化</p>
                <p className="text-muted-foreground text-xs">
                  不作为无意义的页面装饰
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loading state</CardTitle>
          <CardDescription>骨架屏保持真实内容结构与密度。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OverlayPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overlay & tabs</CardTitle>
        <CardDescription>浮层、导航状态与动作层级的组合示例。</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="security">安全</TabsTrigger>
            <TabsTrigger value="events">事件</TabsTrigger>
          </TabsList>
          <TabsContent
            className="mt-4 rounded-lg border bg-surface p-4"
            value="overview"
          >
            <p className="font-medium">服务配置已通过基础检查</p>
            <p className="mt-1 text-muted-foreground text-sm">
              打开 Dialog 查看标准的确认流程与浮层动效。
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">打开确认 Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>应用配置更改？</DialogTitle>
                  <DialogDescription>
                    更新将发送至 12 个在线节点，通常在 30 秒内完成。
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg border bg-surface p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">影响范围</span>
                    <span className="font-medium">12 个节点</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">取消</Button>
                  <Button>确认应用</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          <TabsContent
            className="mt-4 rounded-lg border bg-surface p-4"
            value="security"
          >
            安全策略组件将在对应业务页面重构时接入。
          </TabsContent>
          <TabsContent
            className="mt-4 rounded-lg border bg-surface p-4"
            value="events"
          >
            事件时间线组件将在日志模块重构时接入。
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function UiLab() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-6 sm:py-10">
        <header className="relative overflow-hidden rounded-2xl border bg-card p-[var(--card-padding)] shadow-[var(--shadow-sm)] sm:p-8">
          <div className="-top-28 -right-16 absolute size-72 rounded-full bg-primary/12 blur-3xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Palette className="size-5" />
                </div>
                <Badge variant="secondary">Design System · Phase 1</Badge>
              </div>
              <h1 className="type-display">Perfect Panel UI Lab</h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
                管理界面重构的唯一视觉规范与组件验收入口。所有新页面必须使用这里定义的语义
                Token、排版、密度与 Motion 规则。
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft />
                返回管理入口
              </Link>
            </Button>
          </div>
        </header>

        <div className="mt-10 grid gap-12">
          <LabSection
            description="实时切换明暗主题与三档信息密度，页面中的所有基础组件会同步响应。"
            eyebrow="Foundation 01"
            title="主题与密度"
          >
            <PreferenceControls />
          </LabSection>

          <LabSection
            description="颜色、空间、形状和状态全部通过语义角色连接组件与主题。"
            eyebrow="Foundation 02"
            title="主题 Token"
          >
            <TokenOverview />
          </LabSection>

          <LabSection
            description="五级文字尺度覆盖数据大字、页面标题、组件标题、正文和辅助标签。"
            eyebrow="Foundation 03"
            title="Typography"
          >
            <TypographyPreview />
          </LabSection>

          <LabSection
            description="保持 shadcn 的组合 API，同时统一状态、尺寸、焦点反馈和密度行为。"
            eyebrow="Components 01"
            title="基础组件"
          >
            <ComponentPreview />
          </LabSection>

          <LabSection
            description="面向管理端高信息量场景，表头、数字、状态与行高均有明确规范。"
            eyebrow="Components 02"
            title="数据展示"
          >
            <DataPreview />
          </LabSection>

          <LabSection
            description="用短促、可预测的过渡表达因果关系，并自动尊重系统减少动态效果设置。"
            eyebrow="Behavior 01"
            title="Motion Token"
          >
            <MotionPreview />
          </LabSection>

          <LabSection
            description="验证导航状态、浮层层级、背景遮罩和确认动作的完整组合。"
            eyebrow="Behavior 02"
            title="组合交互"
          >
            <OverlayPreview />
          </LabSection>
        </div>

        <footer className="mt-12 flex flex-col gap-2 border-t py-8 text-muted-foreground text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>Perfect Panel Design System · Phase 1</span>
          <span>Theme · Type · Density · Motion · Components</span>
        </footer>
      </div>
    </main>
  );
}
