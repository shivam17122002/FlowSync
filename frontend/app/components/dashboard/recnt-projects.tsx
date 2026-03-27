import type { Project } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getProjectProgress, getTaskStatusColor } from "@/lib";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { format } from "date-fns";

export const RecentProjects = ({ data }: { data: Project[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="lg:col-spa-2">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No Recent project yet
          </p>
        ) : (
          data.map((project) => {
            const projectProgress = getProjectProgress(project.tasks);

            return (
              <div
                key={project._id}
                className="rounded-[1.35rem] border border-white/70 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Link
                    to={`/workspaces/${workspaceId}/projects/${project._id}`}
                    className="group min-w-0"
                  >
                    <h3 className="flex items-center gap-2 font-medium transition-colors group-hover:text-primary">
                      {project.title}
                      <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                    </h3>
                  </Link>

                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs",
                      getTaskStatusColor(project.status)
                    )}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {project.description}
                </p>
                {project.dueDate && (
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Due {format(new Date(project.dueDate), "MMM d, yyyy")}
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progress</span>
                    <span>{projectProgress}%</span>
                  </div>

                  <Progress value={projectProgress} className="h-2" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
