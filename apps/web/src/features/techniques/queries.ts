import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";

export async function getTechniques(search?: string) {
  const user = await requireUser();
  return prisma.technique.findMany({
    where: {
      ownerId: user.id,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { descriptionText: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      originCourse: { select: { id: true, name: true } },
      originMaterial: { select: { id: true, title: true } },
      _count: {
        select: { recipes: true, references: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTechniqueById(id: string) {
  const user = await requireUser();
  return prisma.technique.findFirst({
    where: { id, ownerId: user.id },
    include: {
      originCourse: true,
      originMaterial: true,
      media: true,
      recipes: {
        include: { recipe: true },
      },
      references: {
        include: { reference: true },
      },
    },
  });
}
