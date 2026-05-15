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
  ResponsiveContainer,
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
    <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
      {/* Task Trends */}
      <Card className="lg:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Task Trends
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground">
              Daily task status changes across {stats.totalTasks} tasks
            </CardDescription>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ChartLine className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="px-2 pb-4 sm:px-4">
          <ChartContainer
            className="h-[260px] sm:h-[320px]"
            config={{
              completed: { color: "#10b981" },
              inProgress: { color: "#3b82f6" },
              todo: { color: "#6b7280" },
            }}
          >
            {taskTrendsData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskTrendsData}>
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
                    height={36}
                    content={<ChartLegendContent />}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No analytics data available
              </div>
            )}
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Project Status */}
      <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Project Status
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground">
              Project status breakdown
            </CardDescription>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <ChartPie className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="px-2 pb-4 sm:px-4">
          <ChartContainer
            className="h-[260px] sm:h-[320px]"
            config={{
              Completed: { color: "#10b981" },
              "In Progress": { color: "#3b82f6" },
              Planning: { color: "#f59e0b" },
            }}
          >
            {projectStatusData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    label={({ percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
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
                    height={36}
                    content={<ChartLegendContent />}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No project data available
              </div>
            )}
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Task Priority */}
      <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Task Priority
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground">
              Task priority breakdown
            </CardDescription>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <ChartPie className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="px-2 pb-4 sm:px-4">
          <ChartContainer
            className="h-[260px] sm:h-[320px]"
            config={{
              High: { color: "#ef4444" },
              Medium: { color: "#f59e0b" },
              Low: { color: "#6b7280" },
            }}
          >
            {taskPriorityData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={taskPriorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
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
                    height={36}
                    content={<ChartLegendContent />}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No priority data available
              </div>
            )}
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Workspace Productivity */}
      <Card className="lg:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Workspace Productivity
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground">
              Task completion by project
            </CardDescription>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-600">
            <ChartBarBig className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="px-2 pb-4 sm:px-4">
          <ChartContainer
            className="h-[260px] sm:h-[320px]"
            config={{
              completed: { color: "#3b82f6" },
              total: { color: "#64748b" },
            }}
          >
            {workspaceProductivityData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workspaceProductivityData}
                  barGap={6}
                  barSize={24}
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
                    radius={[10, 10, 0, 0]}
                    name="Total Tasks"
                  />

                  <Bar
                    dataKey="completed"
                    fill="#3b82f6"
                    radius={[10, 10, 0, 0]}
                    name="Completed Tasks"
                  />

                  <ChartLegend
                    verticalAlign="bottom"
                    height={36}
                    content={<ChartLegendContent />}
                  />
                </BarChart>
              </ResponsiveContainer>
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