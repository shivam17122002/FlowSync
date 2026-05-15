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
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({
  currentWorkspace,
  isCollapsed,
  onCollapsedChange,
}: {
  currentWorkspace: Workspace | null;
  isCollapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
}) => {
  const { logout } = useAuth();

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
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-sidebar/95 text-sidebar-foreground shadow-lg transition-all duration-300 sm:flex",
          isCollapsed ? "w-20" : "w-60"
        )}
      >
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <Link to="/dashboard" className="flex min-w-0 items-center">
            {!isCollapsed && (
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 shadow-inner shadow-white/5">
                  <Share2 className="size-5 text-cyan-300" />
                </div>
                <span className="hidden truncate text-lg font-semibold tracking-tight md:block">
                  FlowSync
                </span>
              </div>
            )}

            {isCollapsed && <Share2 className="size-6 text-cyan-300" />}
          </Link>

          <Button
            variant={"ghost"}
            size="icon"
            className="ml-auto hidden md:flex"
            onClick={() => onCollapsedChange(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-4" />
            )}
          </Button>
        </div>

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
              "w-full justify-start rounded-2xl bg-white/10 text-sidebar-foreground hover:bg-white/15",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className={cn("size-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-white/15 bg-sidebar/95 px-2 py-2 text-sidebar-foreground shadow-[0_20px_55px_-24px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:hidden">
        <SidebarNav
          items={navItems.slice(0, 5)}
          isCollapsed
          className="grid grid-cols-5 gap-1"
          currentWorkspace={currentWorkspace}
        />
      </nav>
    </>
  );
};
