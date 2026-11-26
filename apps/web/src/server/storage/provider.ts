import { Readable } from "node:stream";

export interface StorageMetadata {
  key: string;
  size: number;
  mimeType: string;
  lastModified?: Date;
}

export interface StorageProvider {
  /**
   * Guarda un stream o buffer en la ruta especificada por storageKey.
   */
  upload(
    key: string,
    streamOrBuffer: Readable | Buffer,
    mimeType: string
  ): Promise<{ key: string; size: number }>;

  /**
   * Obtiene un stream de lectura para la clave especificada.
   */
  getReadStream(
    key: string
  ): Promise<{ stream: NodeJS.ReadableStream; size: number; mimeType: string }>;

  /**
   * Verifica si existe un archivo y retorna sus metadatos.
   */
  stat(key: string): Promise<StorageMetadata | null>;

  /**
   * Elimina un archivo.
   */
  delete(key: string): Promise<boolean>;

  /**
   * Retorna la ruta física o URI (solo para worker local / comprobaciones internas).
   */
  resolvePath(key: string): string;
}
