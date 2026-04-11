import Link from "next/link";

import { auth } from "@/lib/auth";
import { listPortfoliosForUser } from "@/server/queries/portfolio";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const portfolios = await listPortfoliosForUser(session.user.id);
  const publishedCount = portfolios.filter((portfolio) => portfolio.isPublished).length;

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {session.user.name ?? "User"}</h1>
        <p className="mt-3 text-sm text-slate-600">
          You are signed in as <span className="font-medium text-slate-800">{session.user.email}</span> with role{" "}
          <span className="font-medium text-slate-800">{session.user.role ?? "USER"}</span>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total portfolios</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{portfolios.length}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Published</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{publishedCount}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Drafts</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{portfolios.length - publishedCount}</p>
        </article>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Portfolio builder</h2>
            <p className="text-sm text-slate-600">Create, edit, publish, or delete portfolios.</p>
          </div>
          <Link
            href="/dashboard/portfolio"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Open portfolio manager
          </Link>
        </div>
      </div>
    </section>
  );
}
