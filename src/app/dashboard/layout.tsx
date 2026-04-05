import Link from "next/link";

import { auth } from "@/lib/auth";
import { logoutAction } from "@/server/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm text-slate-500">Portfolio Builder</p>
            <p className="text-base font-semibold text-slate-900">Dashboard</p>
          </div>

          <nav className="flex items-center gap-4 text-sm text-slate-700">
            <Link href="/dashboard" className="hover:text-slate-900">
              Home
            </Link>
            {session?.user?.role === "ADMIN" ? (
              <Link href="/admin" className="hover:text-slate-900">
                Admin
              </Link>
            ) : null}
            <form action={logoutAction}>
              <button type="submit" className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
