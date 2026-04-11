import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isReservedSlug, isValidSlug, toSlug } from "@/lib/slug";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSlug = searchParams.get("slug") ?? "";
  const excludePortfolioId = searchParams.get("excludePortfolioId");

  const slug = toSlug(rawSlug);

  if (!slug || slug.length < 3) {
    return NextResponse.json({
      slug,
      available: false,
      reason: "Slug must be at least 3 characters",
    });
  }

  if (isReservedSlug(slug) || !isValidSlug(slug)) {
    return NextResponse.json({
      slug,
      available: false,
      reason: "Slug is invalid or reserved",
    });
  }

  const existing = await db.portfolio.findUnique({ where: { slug }, select: { id: true } });

  if (existing && existing.id !== excludePortfolioId) {
    return NextResponse.json({
      slug,
      available: false,
      reason: "Slug is already taken",
    });
  }

  return NextResponse.json({
    slug,
    available: true,
  });
}
