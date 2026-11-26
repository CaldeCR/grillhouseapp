"use server";

import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";
import { storageProvider } from "@/server/storage/local";
import { validateMagicBytes } from "@/server/security/magic-bytes";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";

export async function uploadPdfMaterialAction(formData: FormData) {
  const user = await requireUser();

  const file = formData.get("file") as File | null;
  const courseId = formData.get("courseId") as string;
  const classSessionId = (formData.get("classSessionId") as string) || null;
  const title = (formData.get("title") as string) || file?.name || "Material sin título";
  const sourceAuthor = (formData.get("sourceAuthor") as string) || null;

  if (!file) throw new Error("Archivo PDF requerido");
  if (!courseId) throw new Error("ID de curso requerido");

  // Validar curso perteneciente al usuario
  const course = await prisma.course.findFirst({
    where: { id: courseId, ownerId: user.id },
  });
  if (!course) throw new Error("Curso no encontrado o no autorizado");

  const buffer = Buffer.from(await file.arrayBuffer());

  // Validación estricta por magic bytes (%PDF-)
  const check = validateMagicBytes(buffer, ["application/pdf"]);
  if (!check.valid) {
    throw new Error("El archivo no es un documento PDF válido");
  }

  const fileExt = "pdf";
  const randomSuffix = crypto.randomBytes(8).toString("hex");
  const storageKey = `materials/${user.id}/${Date.now()}_${randomSuffix}.${fileExt}`;

  // Guardar a través de StorageProvider fuera de /public
  await storageProvider.upload(storageKey, buffer, "application/pdf");

  const material = await prisma.material.create({
    data: {
      ownerId: user.id,
      courseId,
      classSessionId,
      title,
      sourceAuthor,
      storageKey,
      fileName: file.name,
      fileSize: buffer.length,
      mimeType: "application/pdf",
    },
  });

  revalidatePath(`/courses/${courseId}`);
  return { success: true, material };
}

export async function deleteMaterialAction(id: string) {
  const user = await requireUser();
  const material = await prisma.material.findFirst({
    where: { id, ownerId: user.id },
  });
  if (!material) throw new Error("Material no encontrado");

  await storageProvider.delete(material.storageKey);
  await prisma.material.delete({ where: { id } });

  revalidatePath(`/courses/${material.courseId}`);
  return { success: true };
}
