import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const starterThemes = [
  {
    key: "minimal",
    name: "Minimal",
    description: "A clean and typography-focused portfolio theme.",
    previewImage: "/theme-previews/minimal.png",
    isActive: true,
    configSchema: {
      accentColor: "#111827",
      showAvatar: true,
    },
  },
  {
    key: "modern",
    name: "Modern",
    description: "A balanced card-based layout with strong visual hierarchy.",
    previewImage: "/theme-previews/modern.png",
    isActive: true,
    configSchema: {
      accentColor: "#2563eb",
      sectionSpacing: "comfortable",
    },
  },
  {
    key: "creative",
    name: "Creative",
    description: "A bold portfolio layout designed for designers and creators.",
    previewImage: "/theme-previews/creative.png",
    isActive: true,
    configSchema: {
      accentGradient: ["#d946ef", "#f97316"],
      showProjectThumbnails: true,
    },
  },
] as const;

async function main() {
  for (const theme of starterThemes) {
    await prisma.theme.upsert({
      where: { key: theme.key },
      update: {
        name: theme.name,
        description: theme.description,
        previewImage: theme.previewImage,
        isActive: theme.isActive,
        configSchema: theme.configSchema,
      },
      create: theme,
    });
  }

  await prisma.featureFlag.upsert({
    where: { key: "cv_parsing_v1" },
    update: {
      name: "CV Parsing v1",
      description: "Enable rule-based CV extraction and portfolio form prefill.",
      isEnabled: true,
    },
    create: {
      key: "cv_parsing_v1",
      name: "CV Parsing v1",
      description: "Enable rule-based CV extraction and portfolio form prefill.",
      isEnabled: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
