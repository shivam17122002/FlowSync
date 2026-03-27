import { Header } from "@/components/layout/header";
import { SidebarComponent } from "@/components/layout/sidebar-component";
import { Loader } from "@/components/loader";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLoaderData, useLocation, useSearchParams } from "react-router";

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchData("/workspaces")]);
    return { workspaces };
  } catch (error) {
    console.log(error);
  }
};
const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { workspaces = [] } = (useLoaderData() as { workspaces?: Workspace[] }) ?? {};
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );

  const workspaceIdFromUrl = useMemo(() => {
    const searchWorkspaceId = searchParams.get("workspaceId");

    if (searchWorkspaceId) {
      return searchWorkspaceId;
    }

    const pathMatch = location.pathname.match(/^\/workspaces\/([^/]+)/);
    return pathMatch?.[1] ?? null;
  }, [location.pathname, searchParams]);

  useEffect(() => {
    if (!workspaceIdFromUrl) {
      setCurrentWorkspace(null);
      return;
    }

    const matchedWorkspace =
      workspaces.find((workspace) => workspace._id === workspaceIdFromUrl) ?? null;

    setCurrentWorkspace(matchedWorkspace);
  }, [workspaceIdFromUrl, workspaces]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <div className="mesh-bg relative flex min-h-screen w-full bg-transparent">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
      <SidebarComponent currentWorkspace={currentWorkspace} />

      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
