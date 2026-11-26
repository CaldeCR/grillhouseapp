"use server";

import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";
import { ReferenceSchema, ReferenceInput } from "./schema";
import { validateAndResolveUrl } from "@/server/security/ssrf-guard";
import { revalidatePath } from "next/cache";

export async function createReferenceAction(data: ReferenceInput) {
  const user = await requireUser();
  const parsed = ReferenceSchema.parse(data);

  // Validación preventiva contra SSRF
  const check = await validateAndResolveUrl(parsed.url);
  if (!check.safe) {
    throw new Error(check.error || "URL no permitida");
  }

  const reference = await prisma.reference.create({
    data: {
      ownerId: user.id,
      url: check.normalizedUrl,
      platform: parsed.platform,
      title: parsed.title,
      notes: parsed.notes,
      thumbnailUrl: parsed.thumbnailUrl,
      isManualThumbnail: parsed.isManualThumbnail,
    },
  });

  revalidatePath("/references");
  return { success: true, reference };
}

export async function deleteReferenceAction(id: string) {
  const user = await requireUser();
  await prisma.reference.delete({
    where: { id, ownerId: user.id },
  });

  revalidatePath("/references");
  return { success: true };
}
