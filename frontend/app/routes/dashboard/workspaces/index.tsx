import { Loader } from "@/components/loader";
import { NoDataFound } from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";
import { ArrowRight, PlusCircle, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";

const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="surface-panel mesh-bg px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="page-intro-label">
                <Sparkles className="h-3.5 w-3.5" />
                Team spaces
              </span>
              <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Workspaces</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                Organize teams, projects, and collaboration lanes in dedicated
                spaces that keep every initiative easy to scan.
              </p>
            </div>

            <Button onClick={() => setIsCreatingWorkspace(true)} className="self-start">
              <PlusCircle className="size-4 mr-2" />
              New Workspace
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">All workspaces</h3>

          <Button onClick={() => setIsCreatingWorkspace(true)} variant="outline">
            <PlusCircle className="size-4 mr-2" />
            Create another
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}

          {workspaces.length === 0 && (
            <NoDataFound
              title="No workspaces found"
              description="Create a new workspace to get started"
              buttonText="Create Workspace"
              buttonAction={() => setIsCreatingWorkspace(true)}
            />
          )}
        </div>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="mesh-bg h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />

              <div>
                <CardTitle>{workspace.name}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  Created at {format(workspace.createdAt, "MMM d, yyyy h:mm a")}
                </span>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Users className="size-4 mr-1" />
              <span className="text-xs">{workspace.members.length}</span>
            </div>
          </div>

          <CardDescription>
            {workspace.description || "No description"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>View workspace details and projects</span>
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspaces;
