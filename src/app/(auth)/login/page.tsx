import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Welcome back. Continue managing your portfolio.</p>

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-sm text-slate-600">
          New here?{" "}
          <Link href="/register" className="font-medium text-slate-900 hover:underline">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
