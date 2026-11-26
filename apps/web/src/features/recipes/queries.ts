import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";

export async function getRecipes(search?: string) {
  const user = await requireUser();
  return prisma.recipe.findMany({
    where: {
      ownerId: user.id,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { stepsText: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      originCourse: { select: { id: true, name: true } },
      originMaterial: { select: { id: true, title: true } },
      media: true,
      _count: {
        select: { techniques: true, references: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecipeById(id: string) {
  const user = await requireUser();
  return prisma.recipe.findFirst({
    where: { id, ownerId: user.id },
    include: {
      originCourse: true,
      originMaterial: true,
      media: true,
      techniques: {
        include: { technique: true },
      },
      references: {
        include: { reference: true },
      },
    },
  });
}
