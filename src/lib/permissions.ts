import type { UserRole } from "@prisma/client";

const ADMIN_ONLY_ROLES: UserRole[] = ["ADMIN"];

export function isAdmin(role: UserRole | undefined | null): boolean {
  return role ? ADMIN_ONLY_ROLES.includes(role) : false;
}
