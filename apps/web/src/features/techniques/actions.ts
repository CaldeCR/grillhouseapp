"use server";

import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";
import { TechniqueSchema, TechniqueInput } from "./schema";
import { revalidatePath } from "next/cache";

export async function createTechniqueAction(data: TechniqueInput) {
  const user = await requireUser();
  const parsed = TechniqueSchema.parse(data);

  const technique = await prisma.technique.create({
    data: {
      ownerId: user.id,
      name: parsed.name,
      descriptionJson: parsed.descriptionJson,
      descriptionText: parsed.descriptionText,
      keyPoints: parsed.keyPoints,
      commonErrors: parsed.commonErrors,
      originCourseId: parsed.originCourseId,
      originMaterialId: parsed.originMaterialId,
      originPage: parsed.originPage,
      originAuthor: parsed.originAuthor,
      references: parsed.referenceIds?.length
        ? {
            create: parsed.referenceIds.map((rId) => ({
              referenceId: rId,
              ownerId: user.id,
            })),
          }
        : undefined,
    },
  });

  revalidatePath("/techniques");
  return { success: true, technique };
}

export async function updateTechniqueAction(id: string, data: Partial<TechniqueInput>) {
  const user = await requireUser();

  const technique = await prisma.technique.update({
    where: { id, ownerId: user.id },
    data: {
      name: data.name,
      descriptionJson: data.descriptionJson,
      descriptionText: data.descriptionText,
      keyPoints: data.keyPoints,
      commonErrors: data.commonErrors,
      originCourseId: data.originCourseId,
      originMaterialId: data.originMaterialId,
      originPage: data.originPage,
      originAuthor: data.originAuthor,
    },
  });

  revalidatePath("/techniques");
  revalidatePath(`/techniques/${id}`);
  return { success: true, technique };
}

export async function deleteTechniqueAction(id: string) {
  const user = await requireUser();
  await prisma.technique.delete({
    where: { id, ownerId: user.id },
  });

  revalidatePath("/techniques");
  return { success: true };
}
