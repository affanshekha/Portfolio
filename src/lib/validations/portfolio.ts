import { z } from "zod";

import { isValidSlug, toSlug } from "@/lib/slug";

const normalizedSlugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug cannot exceed 50 characters")
  .transform((value) => toSlug(value))
  .refine((value) => value.length >= 3, "Slug must be at least 3 characters")
  .refine((value) => isValidSlug(value), "Slug is invalid or reserved");

export const portfolioUpsertSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120),
  headline: z.string().trim().max(160).optional(),
  bio: z.string().trim().max(5000).optional(),
  slug: normalizedSlugSchema,
  seoTitle: z.string().trim().max(120).optional(),
  seoDescription: z.string().trim().max(160).optional(),
  contactEmail: z.union([z.string().trim().email(), z.literal("")]).optional(),
  contactPhone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(120).optional(),
});

export type PortfolioUpsertInput = z.infer<typeof portfolioUpsertSchema>;
