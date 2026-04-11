import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const portfolioInclude = {
  theme: true,
  skills: { orderBy: { sortOrder: "asc" } },
  experiences: { orderBy: { sortOrder: "asc" } },
  educations: { orderBy: { sortOrder: "asc" } },
  projects: { orderBy: { sortOrder: "asc" } },
  certifications: { orderBy: { issueDate: "desc" } },
  socialLinks: { orderBy: { sortOrder: "asc" } },
  mediaAssets: { orderBy: { sortOrder: "asc" } },
  testimonials: { orderBy: { sortOrder: "asc" } },
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

export async function getPublicPortfolioBySlug(slug: string) {
  return db.portfolio.findFirst({
    where: {
      slug,
      isPublished: true,
    },
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

export async function getPortfolioForOwner(portfolioId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return db.portfolio.findFirst({
    where: {
      id: portfolioId,
      userId,
    },
  });
}
