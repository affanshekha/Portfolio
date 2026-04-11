import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm text-slate-500">Portfolio Builder</p>
            <p className="text-base font-semibold text-slate-900">Admin Dashboard</p>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-700 hover:text-slate-900">
            Back to user dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
