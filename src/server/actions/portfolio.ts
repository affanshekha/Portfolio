"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { portfolioUpsertSchema } from "@/lib/validations/portfolio";

export type PortfolioActionState = {
  error?: string;
  success?: string;
};

function normalizeOptional(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function createPortfolioAction(
  _prevState: PortfolioActionState,
  formData: FormData,
): Promise<PortfolioActionState> {
  const userId = await requireUserId();

  const parsed = portfolioUpsertSchema.safeParse({
    title: formData.get("title"),
    headline: normalizeOptional(formData.get("headline")),
    bio: normalizeOptional(formData.get("bio")),
    slug: formData.get("slug"),
    seoTitle: normalizeOptional(formData.get("seoTitle")),
    seoDescription: normalizeOptional(formData.get("seoDescription")),
    contactEmail: normalizeOptional(formData.get("contactEmail")) ?? "",
    contactPhone: normalizeOptional(formData.get("contactPhone")),
    location: normalizeOptional(formData.get("location")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid portfolio data" };
  }

  const slugExists = await db.portfolio.findUnique({ where: { slug: parsed.data.slug } });
  if (slugExists) {
    return { error: "Slug is already taken" };
  }

  const theme = await db.theme.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } });

  await db.portfolio.create({
    data: {
      userId,
      title: parsed.data.title,
      headline: parsed.data.headline,
      bio: parsed.data.bio,
      slug: parsed.data.slug,
      seoTitle: parsed.data.seoTitle,
      seoDescription: parsed.data.seoDescription,
      contactEmail: parsed.data.contactEmail || undefined,
      contactPhone: parsed.data.contactPhone,
      location: parsed.data.location,
      themeId: theme?.id,
      isPublished: false,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");

  return { success: "Portfolio created" };
}

export async function updatePortfolioAction(
  portfolioId: string,
  _prevState: PortfolioActionState,
  formData: FormData,
): Promise<PortfolioActionState> {
  const userId = await requireUserId();

  const existing = await db.portfolio.findUnique({ where: { id: portfolioId } });
  if (!existing || existing.userId !== userId) {
    return { error: "Portfolio not found" };
  }

  const parsed = portfolioUpsertSchema.safeParse({
    title: formData.get("title"),
    headline: normalizeOptional(formData.get("headline")),
    bio: normalizeOptional(formData.get("bio")),
    slug: formData.get("slug"),
    seoTitle: normalizeOptional(formData.get("seoTitle")),
    seoDescription: normalizeOptional(formData.get("seoDescription")),
    contactEmail: normalizeOptional(formData.get("contactEmail")) ?? "",
    contactPhone: normalizeOptional(formData.get("contactPhone")),
    location: normalizeOptional(formData.get("location")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid portfolio data" };
  }

  const slugOwner = await db.portfolio.findUnique({ where: { slug: parsed.data.slug } });
  if (slugOwner && slugOwner.id !== portfolioId) {
    return { error: "Slug is already taken" };
  }

  await db.portfolio.update({
    where: { id: portfolioId },
    data: {
      title: parsed.data.title,
      headline: parsed.data.headline,
      bio: parsed.data.bio,
      slug: parsed.data.slug,
      seoTitle: parsed.data.seoTitle,
      seoDescription: parsed.data.seoDescription,
      contactEmail: parsed.data.contactEmail || undefined,
      contactPhone: parsed.data.contactPhone,
      location: parsed.data.location,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");
  revalidatePath(`/dashboard/portfolio/edit/${portfolioId}`);

  return { success: "Portfolio updated" };
}

export async function deletePortfolioAction(portfolioId: string) {
  const userId = await requireUserId();

  const existing = await db.portfolio.findUnique({ where: { id: portfolioId } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Portfolio not found");
  }

  await db.portfolio.delete({ where: { id: portfolioId } });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");
  redirect("/dashboard/portfolio");
}

export async function togglePublishPortfolioAction(portfolioId: string) {
  const userId = await requireUserId();

  const existing = await db.portfolio.findUnique({ where: { id: portfolioId } });
  if (!existing || existing.userId !== userId) {
    throw new Error("Portfolio not found");
  }

  const nextPublished = !existing.isPublished;

  await db.portfolio.update({
    where: { id: portfolioId },
    data: {
      isPublished: nextPublished,
      publishedAt: nextPublished ? new Date() : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");
}
