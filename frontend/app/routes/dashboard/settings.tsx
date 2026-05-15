import { Loader } from "@/components/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteWorkspaceMutation,
  useGetWorkspaceDetailsQuery,
} from "@/hooks/use-workspace";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId") ?? "";
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteWorkspaceMutation = useDeleteWorkspaceMutation();

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

  const ownerId = typeof data.owner === "string" ? data.owner : data.owner._id;
  const isOwner = ownerId === user?._id;

  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspaceMutation.mutateAsync(workspaceId);
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace deleted");
      setIsDeleteDialogOpen(false);
      navigate("/workspaces");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete workspace"
      );
    }
  };

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

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-5" />
            Delete Workspace
          </CardTitle>
          <CardDescription>
            Permanently remove this workspace, its projects, tasks, comments,
            invitations, and activity history.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isOwner && (
            <Alert>
              <AlertTriangle className="size-4" />
              <AlertTitle>Owner permission required</AlertTitle>
              <AlertDescription>
                Only the workspace owner can delete this workspace.
              </AlertDescription>
            </Alert>
          )}

          <Button
            variant="destructive"
            disabled={!isOwner}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete Workspace
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {data.name}?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All projects, tasks, comments,
              invitations, and activity history in this workspace will be
              permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteWorkspace}
              disabled={deleteWorkspaceMutation.isPending}
            >
              {deleteWorkspaceMutation.isPending
                ? "Deleting..."
                : "Delete Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
