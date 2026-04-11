"use client";

import { useActionState, useMemo, useState } from "react";

import type { Portfolio } from "@prisma/client";

import { toSlug } from "@/lib/slug";
import type { PortfolioActionState } from "@/server/actions/portfolio";

type PortfolioFormProps = {
  submitLabel: string;
  action: (
    state: PortfolioActionState,
    formData: FormData,
  ) => Promise<PortfolioActionState>;
  initialValues?: Partial<Portfolio>;
};

type SlugStatus = {
  status: "idle" | "checking" | "available" | "unavailable";
  message?: string;
};

const initialState: PortfolioActionState = {};

export function BasicInfoForm({ submitLabel, action, initialValues }: PortfolioFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [slugInput, setSlugInput] = useState(initialValues?.slug ?? "");
  const [slugStatus, setSlugStatus] = useState<SlugStatus>({ status: "idle" });

  const normalizedSlug = useMemo(() => toSlug(slugInput), [slugInput]);

  const checkSlug = async () => {
    if (!normalizedSlug) {
      setSlugStatus({ status: "unavailable", message: "Enter a slug first" });
      return;
    }

    setSlugStatus({ status: "checking", message: "Checking availability..." });

    const params = new URLSearchParams({ slug: normalizedSlug });
    if (initialValues?.id) {
      params.set("excludePortfolioId", initialValues.id);
    }

    const response = await fetch(`/api/slug/check?${params.toString()}`);
    const result = (await response.json()) as { available: boolean; reason?: string; slug: string };

    if (result.available) {
      setSlugStatus({ status: "available", message: `/${result.slug} is available` });
      return;
    }

    setSlugStatus({
      status: "unavailable",
      message: result.reason ?? "Slug is unavailable",
    });
  };

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
          Portfolio title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={initialValues?.title ?? ""}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-800 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-slate-700">
          Public slug
        </label>
        <div className="flex gap-2">
          <input
            id="slug"
            name="slug"
            type="text"
            value={slugInput}
            onChange={(event) => {
              setSlugInput(event.target.value);
              setSlugStatus({ status: "idle" });
            }}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-800 focus:ring-2"
          />
          <button
            type="button"
            onClick={checkSlug}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
          >
            Check
          </button>
        </div>
        {normalizedSlug ? <p className="mt-1 text-xs text-slate-500">Normalized: /{normalizedSlug}</p> : null}
        {slugStatus.message ? (
          <p
            className={`mt-1 text-xs ${
              slugStatus.status === "available"
                ? "text-emerald-600"
                : slugStatus.status === "unavailable"
                  ? "text-red-600"
                  : "text-slate-500"
            }`}
          >
            {slugStatus.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="headline" className="mb-1 block text-sm font-medium text-slate-700">
          Headline
        </label>
        <input
          id="headline"
          name="headline"
          type="text"
          defaultValue={initialValues?.headline ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-800 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium text-slate-700">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          defaultValue={initialValues?.bio ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-800 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium text-slate-700">
            Contact email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={initialValues?.contactEmail ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-800 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="mb-1 block text-sm font-medium text-slate-700">
            Contact phone
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="text"
            defaultValue={initialValues?.contactPhone ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-800 focus:ring-2"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="seoTitle" className="mb-1 block text-sm font-medium text-slate-700">
            SEO title
          </label>
          <input
            id="seoTitle"
            name="seoTitle"
            type="text"
            defaultValue={initialValues?.seoTitle ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-800 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={initialValues?.location ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-800 focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="seoDescription" className="mb-1 block text-sm font-medium text-slate-700">
          SEO description
        </label>
        <textarea
          id="seoDescription"
          name="seoDescription"
          rows={3}
          defaultValue={initialValues?.seoDescription ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-800 focus:ring-2"
        />
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
