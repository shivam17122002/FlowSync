import type { StatsCardProps } from "@/types";
import {
  BriefcaseBusiness,
  CheckCheck,
  CircleDashed,
  LoaderCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const StatsCard = ({ data }: { data: StatsCardProps }) => {
  const items = [
    {
      title: "Total Projects",
      value: data.totalProjects,
      meta: `${data.totalProjectInProgress} in progress`,
      icon: BriefcaseBusiness,
      accent: "from-cyan-500/20 to-blue-500/5",
    },
    {
      title: "Total Tasks",
      value: data.totalTasks,
      meta: `${data.totalTaskCompleted} completed`,
      icon: CheckCheck,
      accent: "from-emerald-500/20 to-lime-400/5",
    },
    {
      title: "To Do",
      value: data.totalTaskToDo,
      meta: "Tasks waiting to be done",
      icon: CircleDashed,
      accent: "from-amber-500/20 to-orange-400/5",
    },
    {
      title: "In Progress",
      value: data.totalTaskInProgress,
      meta: "Tasks currently moving",
      icon: LoaderCircle,
      accent: "from-fuchsia-500/20 to-violet-400/5",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className={`overflow-hidden bg-linear-to-br ${item.accent}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-slate-900 shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{item.value}</div>
              <p className="mt-2 text-sm text-muted-foreground">{item.meta}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
