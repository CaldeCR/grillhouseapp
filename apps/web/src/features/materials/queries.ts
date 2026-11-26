import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";

export async function getMaterialsByCourse(courseId: string) {
  const user = await requireUser();
  return prisma.material.findMany({
    where: { courseId, ownerId: user.id },
    include: {
      classSession: true,
      _count: {
        select: { annotations: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMaterialById(id: string) {
  const user = await requireUser();
  return prisma.material.findFirst({
    where: { id, ownerId: user.id },
    include: {
      course: true,
      classSession: true,
      annotations: {
        orderBy: [{ pageNumber: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}
