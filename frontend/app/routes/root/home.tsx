import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FolderKanban, Share2, Users } from "lucide-react";
import { Link } from "react-router";
import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FlowSync | Project Management Made Clear" },
    {
      name: "description",
      content:
        "Plan projects, organize workspaces, track tasks, and collaborate with your team in FlowSync.",
    },
  ];
}

const features = [
  {
    title: "Workspace-first planning",
    description:
      "Keep teams, projects, and members organized inside focused workspaces built for day-to-day execution.",
    icon: FolderKanban,
  },
  {
    title: "Clear team collaboration",
    description:
      "Assign tasks, follow progress, and keep everyone aligned without losing context.",
    icon: Users,
  },
  {
    title: "Reliable progress tracking",
    description:
      "Monitor what is active, what is completed, and what needs attention from one place.",
    icon: CheckCircle2,
  },
];

const stats = [
  { label: "Team visibility", value: "100%" },
  { label: "Project focus", value: "24/7" },
  { label: "Workflow clarity", value: "One hub" },
];

const Homepage = () => {
  return (
    <div
      className="min-h-screen text-slate-950"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 30%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.18), transparent 25%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 45%, #ffffff 100%)",
      }}
    >
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-blue-200">
              <Share2 className="text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">FlowSync</p>
              <p className="text-xs text-slate-500">Team project command center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/sign-in">
              <Button variant="ghost" className="text-slate-700 hover:text-slate-950">
                Login
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button className="rounded-xl bg-slate-950 px-5 text-white hover:bg-slate-800">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Built for modern MERN teams and student projects
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Manage projects, tasks, and team work from one clean hub.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              FlowSync gives your team a single place to organize workspaces, track task
              progress, manage members, and keep every project moving without confusion.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/sign-up">
                <Button className="h-12 rounded-xl bg-blue-600 px-6 text-base text-white hover:bg-blue-700">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/sign-in">
                <Button
                  variant="outline"
                  className="h-12 rounded-xl border-slate-300 bg-white px-6 text-base text-slate-900 hover:bg-slate-50"
                >
                  Explore Login
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-blue-200/45 via-sky-100/40 to-cyan-100/30 blur-3xl" />
            <div className="overflow-hidden rounded-[1.2rem] border border-slate-800/90 bg-[#050b18] p-3 shadow-2xl shadow-blue-200/40">
              <div className="grid gap-3 rounded-[0.9rem] bg-[#06101f] p-3 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-white/6 bg-[#091427] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">
                        Task Trend
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">Daily task volume overview</p>
                    </div>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  </div>

                  <div className="mt-4 h-28">
                    <svg viewBox="0 0 240 110" className="h-full w-full">
                      <path
                        d="M12 74 C35 68, 44 42, 68 48 S107 83, 128 74 S172 36, 228 58"
                        fill="none"
                        stroke="#4FD1C5"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 66 C33 82, 56 87, 82 71 S121 34, 150 49 S194 86, 228 78"
                        fill="none"
                        stroke="#7C8DB5"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      <circle cx="68" cy="48" r="3.5" fill="#4FD1C5" />
                      <circle cx="128" cy="74" r="3.5" fill="#4FD1C5" />
                      <circle cx="184" cy="42" r="3.5" fill="#4FD1C5" />
                    </svg>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-white/6 bg-[#091427] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">
                        Project Status
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">Task completion breakdown</p>
                    </div>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>

                  <div className="mt-5 flex items-center justify-center">
                    <div className="relative h-24 w-24 rounded-full bg-[conic-gradient(#22c55e_0_39%,#3b82f6_39%_74%,#f59e0b_74%_100%)]">
                      <div className="absolute inset-[14px] rounded-full bg-[#091427]" />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Done
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Active
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      Review
                    </span>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-white/6 bg-[#091427] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">
                        Task Priority
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">Priority distribution</p>
                    </div>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </div>

                  <div className="mt-5 flex items-center justify-center">
                    <div className="relative h-24 w-24 rounded-full bg-[conic-gradient(#f59e0b_0_44%,#fb7185_44%_73%,#334155_73%_100%)]">
                      <div className="absolute inset-[14px] rounded-full bg-[#091427]" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
                    <div>
                      <p className="font-semibold text-amber-300">44%</p>
                      <p>High</p>
                    </div>
                    <div>
                      <p className="font-semibold text-rose-300">29%</p>
                      <p>Mid</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-300">27%</p>
                      <p>Low</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-white/6 bg-[#091427] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">
                        Workspace Productivity
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">Output across teams</p>
                    </div>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </div>

                  <div className="mt-5 flex h-28 items-end gap-3">
                    {[92, 70, 82, 56, 40].map((height, index) => (
                      <div key={height} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex h-full w-full items-end">
                          <div
                            className="w-full rounded-t-lg bg-linear-to-t from-blue-600 to-slate-100"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {["DS", "FE", "BE", "QA", "OPS"][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-24">
          <div className="rounded-4xl border border-slate-200/80 bg-white/85 p-6 shadow-xl shadow-slate-200/40 backdrop-blur sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Why FlowSync
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                A simple home for planning, assigning, and finishing work.
              </h2>
              <p className="mt-4 text-slate-600">
                Start from the homepage, invite your team, create a workspace, and move
                from idea to execution without sending people straight into a blank auth
                screen.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
