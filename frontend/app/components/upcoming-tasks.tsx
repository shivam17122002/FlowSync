import type { Task } from "@/types";
import { Link, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

export const UpcomingTasks = ({ data }: { data: Task[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>Here are the tasks that are due soon</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No upcoming tasks yet
          </p>
        ) : (
          data.map((task) => {
            const projectId =
              typeof task.project === "string" ? task.project : task.project?._id;

            return (
              <Link
                to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`}
                key={task._id}
                className="group flex items-start justify-between gap-3 rounded-[1.25rem] border border-white/60 bg-white/60 p-3 transition hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={cn(
                      "mt-0.5 rounded-full p-1.5",
                      task.priority === "High" && "bg-red-100 text-red-700",
                      task.priority === "Medium" && "bg-yellow-100 text-yellow-700",
                      task.priority === "Low" && "bg-gray-100 text-gray-700"
                    )}
                  >
                    {task.status === "Done" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-sm md:text-base">{task.title}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{task.status}</span>
                      {task.dueDate && (
                        <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                      )}
                      <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
