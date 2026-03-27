import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import {
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Share2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Workspaces",
      href: "/workspaces",
      icon: Users,
    },
    {
      title: "My Tasks",
      href: "/my-tasks",
      icon: ListCheck,
    },
    {
      title: "Members",
      href: `/members`,
      icon: Users,
    },
    {
      title: "Achieved",
      href: `/achieved`,
      icon: CheckCircle2,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div
      className={cn(
        "relative z-10 m-3 mr-0 flex flex-col rounded-[1.75rem] border border-white/10 bg-sidebar/95 text-sidebar-foreground shadow-[0_30px_65px_-35px_rgba(15,23,42,0.85)] transition-all duration-300",
        isCollapsed ? "w-16 md:w-20" : "w-16 md:w-60"
      )}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Link to="/dashboard" className="flex items-center">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 shadow-inner shadow-white/5">
                <Share2 className="size-5 text-cyan-300" />
              </div>
              <span className="hidden text-lg font-semibold tracking-tight md:block">
                FlowSync
              </span>
            </div>
          )}

          {isCollapsed && <Share2 className="size-6 text-cyan-300" />}
        </Link>

        <Button
          variant={"ghost"}
          size="icon"
          className="ml-auto hidden md:block"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="mx-3 mt-4 rounded-2xl border border-white/8 bg-white/6 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Logged in as
          </p>
          <p className="mt-2 truncate font-medium">{user?.name}</p>
          <p className="truncate text-sm text-slate-400">{user?.email}</p>
        </div>
      )}

      <ScrollArea className="flex-1 px-3 py-4">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-2")}
          currentWorkspace={currentWorkspace}
        />
      </ScrollArea>

      <div className="border-t border-white/10 p-3">
        <Button
          variant={"secondary"}
          size={isCollapsed ? "icon" : "default"}
          onClick={logout}
          className={cn(
            "w-full justify-start rounded-2xl bg-white/10 text-sidebar-foreground hover:bg-white/15 ",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className={cn("size-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};
