import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";

export async function getMediaList() {
  const user = await requireUser();
  return prisma.media.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecentJobs() {
  const user = await requireUser();
  return prisma.job.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}
