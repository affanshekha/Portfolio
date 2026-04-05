import { notFound } from "next/navigation";

import { BasicInfoForm } from "@/components/forms/portfolio/basic-info-form";
import { updatePortfolioAction } from "@/server/actions/portfolio";
import { getPortfolioForOwner } from "@/server/queries/portfolio";

type EditPortfolioPageProps = {
  params: Promise<{ portfolioId: string }>;
};

export default async function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const { portfolioId } = await params;
  const portfolio = await getPortfolioForOwner(portfolioId);

  if (!portfolio) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Edit portfolio</h1>
      <p className="text-sm text-slate-600">Update your portfolio basics, SEO, slug, and contact information.</p>
      <BasicInfoForm
        submitLabel="Save changes"
        action={updatePortfolioAction.bind(null, portfolioId)}
        initialValues={portfolio}
      />
    </section>
  );
}
