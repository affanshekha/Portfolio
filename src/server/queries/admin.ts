import { db } from "../../lib/db";

export async function getAdminOverviewStats() {
  const [users, portfolios, publishedPortfolios, activeThemes, featureFlags] = await Promise.all([
    db.user.count(),
    db.portfolio.count(),
    db.portfolio.count({ where: { isPublished: true } }),
    db.theme.count({ where: { isActive: true } }),
    db.featureFlag.count({ where: { isEnabled: true } }),
  ]);

  return {
    users,
    portfolios,
    publishedPortfolios,
    activeThemes,
    enabledFeatureFlags: featureFlags,
  };
}

export async function listRecentAuditLogs(limit = 50) {
  return db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function listUsersForAdmin(limit = 100) {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      _count: {
        select: {
          portfolios: true,
          cvUploads: true,
        },
      },
    },
  });
}
