import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublicPortfolioBySlug } from "@/server/queries/portfolio";

type PublicPortfolioPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PublicPortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);

  if (!portfolio) {
    return {
      title: "Portfolio not found",
      description: "This portfolio does not exist or is not published.",
    };
  }

  const title = portfolio.seoTitle || portfolio.title;
  const description = portfolio.seoDescription || portfolio.headline || portfolio.bio || "Public portfolio";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/${portfolio.slug}`,
    },
  };
}

export default async function PublicPortfolioPage({ params }: PublicPortfolioPageProps) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-slate-500">Theme: {portfolio.theme?.name ?? "Default"}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">{portfolio.title}</h1>
        {portfolio.headline ? <p className="mt-3 text-lg text-slate-700">{portfolio.headline}</p> : null}
        {portfolio.bio ? <p className="mt-4 text-sm leading-6 text-slate-600">{portfolio.bio}</p> : null}
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {portfolio.experiences.length > 0 ? (
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Experience</h2>
              <ul className="mt-4 space-y-4">
                {portfolio.experiences.map((item) => (
                  <li key={item.id} className="border-l-2 border-slate-200 pl-4">
                    <p className="font-medium text-slate-900">
                      {item.title} · {item.company}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.startDate ? new Date(item.startDate).toLocaleDateString() : ""}
                      {item.endDate ? ` - ${new Date(item.endDate).toLocaleDateString()}` : item.isCurrent ? " - Present" : ""}
                    </p>
                    {item.description ? <p className="mt-2 text-sm text-slate-600">{item.description}</p> : null}
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {portfolio.projects.length > 0 ? (
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Projects</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {portfolio.projects.map((project) => (
                  <div key={project.id} className="rounded-lg border border-slate-200 p-4">
                    <p className="font-medium text-slate-900">{project.title}</p>
                    {project.description ? <p className="mt-2 text-sm text-slate-600">{project.description}</p> : null}
                    {project.technologies.length > 0 ? (
                      <p className="mt-2 text-xs text-slate-500">{project.technologies.join(" • ")}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {portfolio.educations.length > 0 ? (
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Education</h2>
              <ul className="mt-4 space-y-3">
                {portfolio.educations.map((item) => (
                  <li key={item.id}>
                    <p className="font-medium text-slate-900">{item.school}</p>
                    <p className="text-sm text-slate-600">
                      {[item.degree, item.fieldOfStudy].filter(Boolean).join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>

        <aside className="space-y-6">
          {portfolio.skills.length > 0 ? (
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <li key={skill.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {portfolio.socialLinks.length > 0 ? (
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Social</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {portfolio.socialLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} className="text-slate-700 underline underline-offset-4" target="_blank" rel="noreferrer">
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              {portfolio.contactEmail ? <p>Email: {portfolio.contactEmail}</p> : null}
              {portfolio.contactPhone ? <p>Phone: {portfolio.contactPhone}</p> : null}
              {portfolio.location ? <p>Location: {portfolio.location}</p> : null}
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
