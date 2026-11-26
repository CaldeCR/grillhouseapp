"use server";

import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";
import { enqueueJob } from "@/server/jobs/enqueue";
import { VideoTranscodeRequestSchema, VideoTranscodeRequest } from "./schema";
import { revalidatePath } from "next/cache";

export async function enqueueVideoTranscodeAction(data: VideoTranscodeRequest) {
  const user = await requireUser();
  const parsed = VideoTranscodeRequestSchema.parse(data);

  const media = await prisma.media.findFirst({
    where: { id: parsed.mediaId, ownerId: user.id },
  });

  if (!media) throw new Error("Video no encontrado");
  if (media.mediaType !== "VIDEO") throw new Error("El archivo seleccionado no es un video");

  // Actualizar estado de media a PENDING
  await prisma.media.update({
    where: { id: media.id },
    data: {
      transcodingStatus: "PENDING",
      videoPreset: parsed.preset,
    },
  });

  // Encolar trabajo en la base de datos para el worker de Python
  const job = await enqueueJob({
    ownerId: user.id,
    type: "VIDEO_TRANSCODE",
    payload: {
      mediaId: media.id,
      inputKey: media.storageKey,
      preset: parsed.preset,
    },
  });

  revalidatePath("/media");
  return { success: true, job };
}

export async function deleteMediaAction(id: string) {
  const user = await requireUser();
  await prisma.media.delete({
    where: { id, ownerId: user.id },
  });

  revalidatePath("/media");
  return { success: true };
}
