import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";

export async function getCourses() {
  const user = await requireUser();
  return prisma.course.findMany({
    where: { ownerId: user.id },
    include: {
      _count: {
        select: {
          materials: true,
          classSessions: true,
          recipes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseById(id: string) {
  const user = await requireUser();
  return prisma.course.findFirst({
    where: { id, ownerId: user.id },
    include: {
      classSessions: {
        orderBy: { sessionNumber: "asc" },
      },
      materials: {
        orderBy: { createdAt: "desc" },
      },
      recipes: {
        orderBy: { createdAt: "desc" },
      },
      techniques: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
