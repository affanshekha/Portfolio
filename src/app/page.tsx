import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-8 px-6 py-20 text-center">
      <p className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
        Portfolio Builder
      </p>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Build your portfolio website in minutes
      </h1>
      <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
        Create, customize, and publish your portfolio with themes, structured content, and your own public URL.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/register"
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
