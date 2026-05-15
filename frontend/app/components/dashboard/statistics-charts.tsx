import type {
  ProjectStatusData,
  StatsCardProps,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { ChartBarBig, ChartLine, ChartPie } from "lucide-react";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

interface StatisticsChartsProps {
  stats: StatsCardProps;
  taskTrendsData: TaskTrendsData[];
  projectStatusData: ProjectStatusData[];
  taskPriorityData: TaskPriorityData[];
  workspaceProductivityData: WorkspaceProductivityData[];
}

export const StatisticsCharts = ({
  stats,
  taskTrendsData,
  projectStatusData,
  taskPriorityData,
  workspaceProductivityData,
}: StatisticsChartsProps) => {
  return (
    <div className="mb-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {/* Task Trends */}
      <Card className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:col-span-2">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-4 pb-2">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">
              Task Trends
            </CardTitle>

            <CardDescription className="text-xs text-muted-foreground sm:text-sm">
              Daily task status changes across {stats.totalTasks} tasks
            </CardDescription>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ChartLine className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <ChartContainer
            className="h-[220px] w-full sm:h-[240px] lg:h-[260px]"
            config={{
              completed: { color: "#10b981" },
              inProgress: { color: "#3b82f6" },
              todo: { color: "#6b7280" },
            }}
          >
            {taskTrendsData?.length > 0 ? (
              <LineChart data={taskTrendsData} margin={{ left: -16, right: 8 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.15}
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <ChartTooltip
                  content={
                    <ChartTooltipContent className="rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl" />
                  }
                />

                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  strokeLinecap="round"
                  dot={{ r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="inProgress"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  strokeLinecap="round"
                  dot={{ r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="todo"
                  stroke="#6b7280"
                  strokeWidth={3}
                  strokeLinecap="round"
                  dot={{ r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />

                <ChartLegend
                  verticalAlign="bottom"
                  height={28}
                  content={<ChartLegendContent />}
                />
              </LineChart>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No analytics data available
              </div>
            )}
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Project Status */}
      <Card className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-4 pb-2">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">
              Project Status
            </CardTitle>

            <CardDescription className="text-xs text-muted-foreground sm:text-sm">
              Project status breakdown
            </CardDescription>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <ChartPie className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <ChartContainer
            className="h-[220px] w-full sm:h-[240px] lg:h-[260px]"
            config={{
              Completed: { color: "#10b981" },
              "In Progress": { color: "#3b82f6" },
              Planning: { color: "#f59e0b" },
            }}
          >
            {projectStatusData?.length > 0 ? (
              <PieChart margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="48%"
                  dataKey="value"
                  nameKey="name"
                  innerRadius="48%"
                  outerRadius="68%"
                  paddingAngle={3}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <ChartTooltip
                  content={
                    <ChartTooltipContent className="rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl" />
                  }
                />

                <ChartLegend
                  verticalAlign="bottom"
                  height={28}
                  content={<ChartLegendContent />}
                />
              </PieChart>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No project data available
              </div>
            )}
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Task Priority */}
      <Card className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-4 pb-2">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">
              Task Priority
            </CardTitle>

            <CardDescription className="text-xs text-muted-foreground sm:text-sm">
              Task priority breakdown
            </CardDescription>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <ChartPie className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <ChartContainer
            className="h-[220px] w-full sm:h-[240px] lg:h-[260px]"
            config={{
              High: { color: "#ef4444" },
              Medium: { color: "#f59e0b" },
              Low: { color: "#6b7280" },
            }}
          >
            {taskPriorityData?.length > 0 ? (
              <PieChart margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <Pie
                  data={taskPriorityData}
                  cx="50%"
                  cy="48%"
                  innerRadius="48%"
                  outerRadius="68%"
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {taskPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <ChartTooltip
                  content={
                    <ChartTooltipContent className="rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl" />
                  }
                />

                <ChartLegend
                  verticalAlign="bottom"
                  height={28}
                  content={<ChartLegendContent />}
                />
              </PieChart>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No priority data available
              </div>
            )}
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Workspace Productivity */}
      <Card className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:col-span-2">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-4 pb-2">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">
              Workspace Productivity
            </CardTitle>

            <CardDescription className="text-xs text-muted-foreground sm:text-sm">
              Task completion by project
            </CardDescription>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-600">
            <ChartBarBig className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <ChartContainer
            className="h-[220px] w-full sm:h-[240px] lg:h-[260px]"
            config={{
              completed: { color: "#3b82f6" },
              total: { color: "#64748b" },
            }}
          >
            {workspaceProductivityData?.length > 0 ? (
              <BarChart
                data={workspaceProductivityData}
                barGap={6}
                barSize={20}
                margin={{ left: -16, right: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.15}
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <ChartTooltip
                  content={
                    <ChartTooltipContent className="rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl" />
                  }
                />

                <Bar
                  dataKey="total"
                  fill="#64748b"
                  radius={[8, 8, 0, 0]}
                  name="Total Tasks"
                />

                <Bar
                  dataKey="completed"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  name="Completed Tasks"
                />

                <ChartLegend
                  verticalAlign="bottom"
                  height={28}
                  content={<ChartLegendContent />}
                />
              </BarChart>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No productivity data available
              </div>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
