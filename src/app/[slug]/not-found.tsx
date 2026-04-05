import Link from "next/link";

export default function PublicPortfolioNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Portfolio not found</h1>
      <p className="mt-3 text-sm text-slate-600">
        This portfolio is missing or not currently published.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Go home
      </Link>
    </main>
  );
}
