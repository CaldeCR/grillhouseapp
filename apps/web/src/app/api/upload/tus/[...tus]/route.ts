import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import path from "node:path";
import { NextRequest } from "next/server";
import { getOptionalUser } from "@/server/auth/require-user";

const uploadsRoot =
  process.env.STORAGE_LOCAL_ROOT ||
  path.resolve(process.cwd(), "../../uploads_data/tus");

const tusServer = new Server({
  path: "/api/upload/tus",
  datastore: new FileStore({
    directory: uploadsRoot,
  }),
  maxSize: 50 * 1024 * 1024, // Chunks de 50 MB
  respectForwardedHeaders: true,
  onUploadCreate: async (req, res, upload) => {
    // Validar usuario
    return res;
  },
});

export async function POST(req: NextRequest): Promise<Response> {
  const user = await getOptionalUser();
  if (!user) {
    return new Response("No autenticado", { status: 401 });
  }
  // @ts-expect-error adapter handling
  return (await tusServer.handle(req)) as unknown as Response;
}

export async function PATCH(req: NextRequest): Promise<Response> {
  const user = await getOptionalUser();
  if (!user) {
    return new Response("No autenticado", { status: 401 });
  }
  // @ts-expect-error adapter handling
  return (await tusServer.handle(req)) as unknown as Response;
}

export async function HEAD(req: NextRequest): Promise<Response> {
  // @ts-expect-error adapter handling
  return (await tusServer.handle(req)) as unknown as Response;
}

export async function OPTIONS(req: NextRequest): Promise<Response> {
  // @ts-expect-error adapter handling
  return (await tusServer.handle(req)) as unknown as Response;
}
