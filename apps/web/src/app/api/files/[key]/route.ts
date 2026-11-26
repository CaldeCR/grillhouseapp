import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { storageProvider } from "@/server/storage/local";
import { prisma } from "@/server/db/prisma";
import { Readable } from "node:stream";

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const user = await requireUser();
    const key = decodeURIComponent(params.key);

    // Verificar en base de datos si el material o media pertenece al usuario
    const [material, media] = await Promise.all([
      prisma.material.findFirst({
        where: { storageKey: key, ownerId: user.id },
      }),
      prisma.media.findFirst({
        where: {
          OR: [{ storageKey: key }, { thumbnailKey: key }],
          ownerId: user.id,
        },
      }),
    ]);

    if (!material && !media) {
      return new NextResponse("Archivo no encontrado o acceso denegado", {
        status: 404,
      });
    }

    const fileData = await storageProvider.getReadStream(key);
    const mimeType = material ? material.mimeType : (media ? media.mimeType : fileData.mimeType);
    const fileName = material ? material.fileName : (media ? media.originalName : "archivo");

    // Convertir NodeJS.ReadableStream a Web ReadableStream
    const nodeStream = fileData.stream as Readable;
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    const isPdfOrImageOrVideo =
      mimeType.startsWith("image/") ||
      mimeType === "application/pdf" ||
      mimeType.startsWith("video/");

    const disposition = isPdfOrImageOrVideo ? "inline" : `attachment; filename="${fileName}"`;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": fileData.size.toString(),
        "Content-Disposition": disposition,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    return new NextResponse("Error obteniendo archivo", { status: 500 });
  }
}
