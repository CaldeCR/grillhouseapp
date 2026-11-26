import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";

export async function getReferences() {
  const user = await requireUser();
  return prisma.reference.findMany({
    where: { ownerId: user.id },
    include: {
      _count: {
        select: { recipeReferences: true, techniqueReferences: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
