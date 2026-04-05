import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome, {session?.user?.name ?? "User"}</h1>
      <p className="mt-3 text-sm text-slate-600">
        You are signed in as <span className="font-medium text-slate-800">{session?.user?.email}</span> with role{" "}
        <span className="font-medium text-slate-800">{session?.user?.role ?? "USER"}</span>.
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Phase 2 is active: authentication, role-based access control, and protected routes are now wired.
      </p>
    </section>
  );
}
