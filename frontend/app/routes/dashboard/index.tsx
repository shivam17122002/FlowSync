import { RecentProjects } from "@/components/dashboard/recnt-projects";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { Loader } from "@/components/loader";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import { ArrowRight, Folders, Sparkles, Workflow } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const emptyStats: StatsCardProps = {
  totalProjects: 0,
  totalTasks: 0,
  totalProjectInProgress: 0,
  totalTaskCompleted: 0,
  totalTaskToDo: 0,
  totalTaskInProgress: 0,
};

type DashboardData = {
  stats: StatsCardProps;
  taskTrendsData: TaskTrendsData[];
  projectStatusData: ProjectStatusData[];
  taskPriorityData: TaskPriorityData[];
  workspaceProductivityData: WorkspaceProductivityData[];
  upcomingTasks: Task[];
  recentProjects: Project[];
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId") ?? "";

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId) as {
    data?: Partial<DashboardData>;
    isPending: boolean;
  };

  const dashboardData: DashboardData = {
    stats: data?.stats ?? emptyStats,
    taskTrendsData: data?.taskTrendsData ?? [],
    projectStatusData: data?.projectStatusData ?? [],
    taskPriorityData: data?.taskPriorityData ?? [],
    workspaceProductivityData: data?.workspaceProductivityData ?? [],
    upcomingTasks: data?.upcomingTasks ?? [],
    recentProjects: data?.recentProjects ?? [],
  };

  if (!workspaceId) {
    return (
      <div className="surface-panel mesh-bg px-6 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Workflow className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold">Pick a workspace to begin</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Your dashboard becomes much more useful once it is scoped to the right
          team. Select a workspace from the header to see live progress, charts,
          and upcoming work.
        </p>
        <Link to="/workspaces" className="mt-6 inline-flex">
          <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20">
            Browse workspaces
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="surface-panel mesh-bg overflow-hidden px-6 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <span className="page-intro-label">
              <Sparkles className="h-3.5 w-3.5" />
              Team command center
            </span>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Dashboard overview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Track projects, monitor task momentum, and keep the next priorities
              visible without bouncing between screens.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.4rem] border border-white/70 bg-white/70 p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Projects in motion</p>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-3xl font-semibold">
                  {dashboardData.stats.totalProjectInProgress}
                </p>
                <Folders className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-white/70 bg-slate-950 p-4 text-white shadow-lg">
              <p className="text-sm text-slate-300">Completion signal</p>
              <p className="mt-2 text-3xl font-semibold">
                {dashboardData.stats.totalTasks === 0
                  ? "0%"
                  : `${Math.round(
                      (dashboardData.stats.totalTaskCompleted /
                        dashboardData.stats.totalTasks) *
                        100
                    )}%`}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Based on tasks completed inside this workspace.
              </p>
            </div>
          </div>
        </div>
      </div>

      <StatsCard data={dashboardData.stats} />

      <StatisticsCharts
        stats={dashboardData.stats}
        taskTrendsData={dashboardData.taskTrendsData}
        projectStatusData={dashboardData.projectStatusData}
        taskPriorityData={dashboardData.taskPriorityData}
        workspaceProductivityData={dashboardData.workspaceProductivityData}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects data={dashboardData.recentProjects} />
        <UpcomingTasks data={dashboardData.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
