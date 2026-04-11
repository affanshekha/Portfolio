import { getAdminOverviewStats } from "@/server/queries/admin";

export default async function AdminPage() {
  const stats = await getAdminOverviewStats();

  const cards = [
    { label: "Users", value: stats.users },
    { label: "Portfolios", value: stats.portfolios },
    { label: "Published", value: stats.publishedPortfolios },
    { label: "Active themes", value: stats.activeThemes },
    { label: "Enabled feature flags", value: stats.enabledFeatureFlags },
  ];

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Platform overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
