import { db } from "../../lib/db";

export const portfolioInclude = {
  theme: true,
  skills: { orderBy: { sortOrder: "asc" as const } },
  experiences: { orderBy: { sortOrder: "asc" as const } },
  educations: { orderBy: { sortOrder: "asc" as const } },
  projects: { orderBy: { sortOrder: "asc" as const } },
  certifications: true,
  socialLinks: { orderBy: { sortOrder: "asc" as const } },
  mediaAssets: { orderBy: { sortOrder: "asc" as const } },
  testimonials: { orderBy: { sortOrder: "asc" as const } },
};

export async function getPortfolioById(id: string) {
  return db.portfolio.findUnique({
    where: { id },
    include: portfolioInclude,
  });
}

export async function getPortfolioBySlug(slug: string) {
  return db.portfolio.findUnique({
    where: { slug },
    include: portfolioInclude,
  });
}

export async function listPortfoliosForUser(userId: string) {
  return db.portfolio.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      theme: true,
      _count: {
        select: {
          projects: true,
          experiences: true,
          skills: true,
        },
      },
    },
  });
}
