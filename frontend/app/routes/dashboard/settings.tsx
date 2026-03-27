import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetWorkspaceDetailsQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";
import { useSearchParams } from "react-router";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId") ?? "";

  const { data, isPending } = useGetWorkspaceDetailsQuery(workspaceId) as {
    data?: Workspace;
    isPending: boolean;
  };

  if (!workspaceId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Select a workspace to view its settings.
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

  if (!data) {
    return <div>No workspace found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workspace Settings</h1>
        <p className="text-sm text-muted-foreground">
          Basic workspace information and membership summary.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Current workspace details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{data.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">
                {data.description?.trim() || "No description added yet"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Color</p>
              <div className="mt-2 flex items-center gap-3">
                <span
                  className="inline-block h-5 w-5 rounded-full border"
                  style={{ backgroundColor: data.color }}
                />
                <code className="rounded bg-muted px-2 py-1 text-sm">{data.color}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Workspace roles at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total members</span>
              <Badge variant="secondary">{data.members.length}</Badge>
            </div>

            {data.members.map((member) => (
              <div
                key={member.user._id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
                <Badge
                  variant={
                    ["admin", "owner"].includes(member.role) ? "destructive" : "outline"
                  }
                  className="capitalize"
                >
                  {member.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
