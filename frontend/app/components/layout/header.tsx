import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { Button } from "../ui/button";
import { Bell, ChevronDown, PlusCircle, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";

interface HeaderProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  onCreateWorkspace: () => void;
}

export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}: HeaderProps) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };
  const isOnWorkspacePage = useLocation().pathname.includes("/workspace");

  const handleOnClick = (workspace: Workspace) => {
    onWorkspaceSelected(workspace);
    const location = window.location;

    if (isOnWorkspacePage) {
      navigate(`/workspaces/${workspace._id}`);
    } else {
      const basePath = location.pathname;

      navigate(`${basePath}?workspaceId=${workspace._id}`);
    }
  };

  return (
    <div className="sticky top-0 z-40 px-3 pt-3 sm:px-6 lg:px-8">
      <div className="surface-panel flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"outline"}
              className="h-auto min-w-[220px] justify-between rounded-2xl border-white/70 px-3 py-2"
            >
              <span className="flex items-center gap-3">
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}
                    <span className="text-left">
                      <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Active Workspace
                      </span>
                      <span className="font-medium">{selectedWorkspace?.name}</span>
                    </span>
                </>
              ) : (
                  <span className="text-left">
                    <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Dashboard Scope
                    </span>
                    <span className="font-medium">Select Workspace</span>
                  </span>
              )}
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[260px] rounded-2xl">
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws._id}
                  onClick={() => handleOnClick(ws)}
                  className="rounded-xl"
                >
                  {ws.color && (
                    <WorkspaceAvatar color={ws.color} name={ws.name} />
                  )}
                  <span className="ml-2">{ws.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onCreateWorkspace} className="rounded-xl">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2 text-sm shadow-sm">
            <p className="flex items-center gap-2 font-medium text-slate-900">
              <Sparkles className="size-4 text-amber-500" />
              Focus mode
            </p>
            <p className="text-xs text-muted-foreground">
              Stay on top of projects, tasks, and workspace activity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl border border-white/50 bg-white/70"
          >
            <Bell />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/75 p-1.5 pl-2 shadow-sm transition hover:border-primary/25 hover:bg-white">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52 rounded-2xl">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl">
                <Link to="/user/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="rounded-xl">
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
