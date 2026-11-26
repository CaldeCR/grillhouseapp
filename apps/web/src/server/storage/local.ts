import { StorageMetadata, StorageProvider } from "./provider";
import fs from "node:fs";
import path from "node:path";
import { Readable, pipeline } from "node:stream";
import { promisify } from "node:util";

const streamPipeline = promisify(pipeline);

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(baseDir?: string) {
    const root =
      baseDir ||
      process.env.STORAGE_LOCAL_ROOT ||
      path.resolve(process.cwd(), "../../uploads_data");
    this.baseDir = path.resolve(root);

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  resolvePath(key: string): string {
    // Prevenir directory traversal
    const safeKey = path.normalize(key).replace(/^(\.\.[\/\\])+/, "");
    const resolved = path.join(this.baseDir, safeKey);
    if (!resolved.startsWith(this.baseDir)) {
      throw new Error("Acceso no permitido fuera del directorio de almacenamiento");
    }
    return resolved;
  }

  async upload(
    key: string,
    streamOrBuffer: Readable | Buffer,
    mimeType: string
  ): Promise<{ key: string; size: number }> {
    const targetPath = this.resolvePath(key);
    const targetDir = path.dirname(targetPath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (Buffer.isBuffer(streamOrBuffer)) {
      await fs.promises.writeFile(targetPath, streamOrBuffer);
      return { key, size: streamOrBuffer.length };
    }

    const writeStream = fs.createWriteStream(targetPath);
    await streamPipeline(streamOrBuffer, writeStream);
    const stats = await fs.promises.stat(targetPath);
    return { key, size: stats.size };
  }

  async getReadStream(
    key: string
  ): Promise<{ stream: NodeJS.ReadableStream; size: number; mimeType: string }> {
    const filePath = this.resolvePath(key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${key}`);
    }

    const stats = await fs.promises.stat(filePath);
    const stream = fs.createReadStream(filePath);
    
    // Inferencia básica de mimeType si no viene almacenado
    let mimeType = "application/octet-stream";
    if (key.endsWith(".pdf")) mimeType = "application/pdf";
    else if (key.endsWith(".mp4")) mimeType = "video/mp4";
    else if (key.endsWith(".jpg") || key.endsWith(".jpeg")) mimeType = "image/jpeg";
    else if (key.endsWith(".png")) mimeType = "image/png";
    else if (key.endsWith(".webp")) mimeType = "image/webp";

    return { stream, size: stats.size, mimeType };
  }

  async stat(key: string): Promise<StorageMetadata | null> {
    const filePath = this.resolvePath(key);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const stats = await fs.promises.stat(filePath);
    return {
      key,
      size: stats.size,
      mimeType: "application/octet-stream",
      lastModified: stats.mtime,
    };
  }

  async delete(key: string): Promise<boolean> {
    try {
      const filePath = this.resolvePath(key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

// Singleton de almacenamiento
export const storageProvider: StorageProvider = new LocalStorageProvider();
