import { db } from "../../lib/db";

export async function listActiveThemes() {
  return db.theme.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function listAllThemes() {
  return db.theme.findMany({
    orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
    include: {
      _count: {
        select: {
          portfolios: true,
        },
      },
    },
  });
}

export async function getThemeByKey(key: string) {
  return db.theme.findUnique({ where: { key } });
}

export async function getThemeById(id: string) {
  return db.theme.findUnique({ where: { id } });
}
