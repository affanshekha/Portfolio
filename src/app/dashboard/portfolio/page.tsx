import Link from "next/link";

import { auth } from "@/lib/auth";
import { BasicInfoForm } from "@/components/forms/portfolio/basic-info-form";
import {
  createPortfolioAction,
  deletePortfolioAction,
  togglePublishPortfolioAction,
} from "@/server/actions/portfolio";
import { listPortfoliosForUser } from "@/server/queries/portfolio";

export default async function PortfolioDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const portfolios = await listPortfoliosForUser(session.user.id);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Create portfolio</h1>
        <p className="mt-2 text-sm text-slate-600">
          Start with basic information. You can edit and publish later from this dashboard.
        </p>

        <div className="mt-4">
          <BasicInfoForm submitLabel="Create portfolio" action={createPortfolioAction} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Your portfolios</h2>

        {portfolios.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No portfolios yet. Create your first one above.
          </p>
        ) : (
          <div className="space-y-3">
            {portfolios.map((portfolio) => (
              <article
                key={portfolio.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{portfolio.title}</h3>
                  <p className="text-sm text-slate-600">/{portfolio.slug}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {portfolio.isPublished ? "Published" : "Draft"} · Updated{" "}
                    {portfolio.updatedAt.toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/portfolio/edit/${portfolio.id}`}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                  >
                    Edit
                  </Link>

                  {portfolio.isPublished ? (
                    <Link
                      href={`/${portfolio.slug}`}
                      target="_blank"
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                    >
                      View public
                    </Link>
                  ) : null}

                  <form action={togglePublishPortfolioAction.bind(null, portfolio.id)}>
                    <button
                      type="submit"
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                    >
                      {portfolio.isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </form>

                  <form action={deletePortfolioAction.bind(null, portfolio.id)}>
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
