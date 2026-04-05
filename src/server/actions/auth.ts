"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  error?: string;
};

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const email = parsed.data.email.toLowerCase();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email is already registered" };
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      role: "USER",
    },
  });

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: "/dashboard",
  });

  return {};
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email or password" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error;
  }

  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
  redirect("/login");
}
