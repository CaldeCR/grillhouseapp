"use server";

import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";
import { AnnotationSchema, AnnotationInput } from "./schema";
import { revalidatePath } from "next/cache";

export async function createAnnotationAction(data: AnnotationInput) {
  const user = await requireUser();
  const parsed = AnnotationSchema.parse(data);

  // Validar pertenencia del material
  const material = await prisma.material.findFirst({
    where: { id: parsed.materialId, ownerId: user.id },
  });
  if (!material) throw new Error("Material no encontrado");

  const annotation = await prisma.annotation.create({
    data: {
      ownerId: user.id,
      materialId: parsed.materialId,
      pageNumber: parsed.pageNumber,
      type: parsed.type,
      position: parsed.position,
      quoteText: parsed.quoteText,
      comment: parsed.comment,
      color: parsed.color,
    },
  });

  revalidatePath(`/courses/${material.courseId}/materials/${material.id}`);
  return { success: true, annotation };
}

export async function updateAnnotationAction(
  id: string,
  data: { comment?: string; color?: string }
) {
  const user = await requireUser();
  const annotation = await prisma.annotation.update({
    where: { id, ownerId: user.id },
    data,
  });

  return { success: true, annotation };
}

export async function deleteAnnotationAction(id: string) {
  const user = await requireUser();
  await prisma.annotation.delete({
    where: { id, ownerId: user.id },
  });

  return { success: true };
}
