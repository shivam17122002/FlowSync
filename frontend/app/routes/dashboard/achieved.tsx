import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import { format } from "date-fns";
import { ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

const Achieved = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId") ?? "";
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params.search = search;

    setSearchParams(params, { replace: true });
  }, [search, searchParams, setSearchParams]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) setSearch(urlSearch);
  }, [search, searchParams]);

  const { data: myTasks, isPending } = useGetMyTasksQuery() as {
    data?: Task[];
    isPending: boolean;
  };

  const archivedTasks = useMemo(() => {
    const allTasks = myTasks ?? [];

    return allTasks.filter((task) => {
      const taskWorkspaceId =
        typeof task.project.workspace === "string"
          ? task.project.workspace
          : task.project.workspace?._id;

      const matchesWorkspace = workspaceId ? taskWorkspaceId === workspaceId : true;
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());

      return task.isArchived && matchesWorkspace && matchesSearch;
    });
  }, [myTasks, search, workspaceId]);

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Achieved Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Archived tasks assigned to you{workspaceId ? " in this workspace" : ""}.
          </p>
        </div>
      </div>

      <Input
        placeholder="Search archived tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Archived Tasks</CardTitle>
              <CardDescription>{archivedTasks.length} archived tasks found</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="divide-y">
                {archivedTasks.map((task) => {
                  const taskWorkspaceId =
                    typeof task.project.workspace === "string"
                      ? task.project.workspace
                      : task.project.workspace?._id;

                  return (
                    <div key={task._id} className="p-4 hover:bg-muted/50">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-3">
                          {task.status === "Done" ? (
                            <CheckCircle className="mt-1 size-4 text-green-500" />
                          ) : (
                            <Clock className="mt-1 size-4 text-yellow-500" />
                          )}

                          <div>
                            <Link
                              to={`/workspaces/${taskWorkspaceId}/projects/${task.project._id}/tasks/${task._id}`}
                              className="font-medium hover:text-primary hover:underline transition-colors inline-flex items-center"
                            >
                              {task.title}
                              <ArrowUpRight className="ml-1 size-4" />
                            </Link>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge variant="outline">Archived</Badge>
                              <Badge
                                variant={task.status === "Done" ? "default" : "secondary"}
                              >
                                {task.status}
                              </Badge>
                              <Badge
                                variant={
                                  task.priority === "High" ? "destructive" : "secondary"
                                }
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>
                            Project: <span className="font-medium">{task.project.title}</span>
                          </div>
                          <div>Modified on: {format(task.updatedAt, "PPPP")}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {archivedTasks.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No archived tasks found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {archivedTasks.map((task) => {
              const taskWorkspaceId =
                typeof task.project.workspace === "string"
                  ? task.project.workspace
                  : task.project.workspace?._id;

              return (
                <Card key={task._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {task.description || "No description"}
                        </p>
                      </div>
                      <Badge variant="outline">Archived</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={task.status === "Done" ? "default" : "secondary"}>
                        {task.status}
                      </Badge>
                      <Badge
                        variant={task.priority === "High" ? "destructive" : "secondary"}
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>{task.project.title}</div>
                      <div>Updated: {format(task.updatedAt, "PPPP")}</div>
                    </div>

                    <Link
                      to={`/workspaces/${taskWorkspaceId}/projects/${task.project._id}/tasks/${task._id}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Open task
                      <ArrowUpRight className="ml-1 size-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}

            {archivedTasks.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No archived tasks found
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achieved;
