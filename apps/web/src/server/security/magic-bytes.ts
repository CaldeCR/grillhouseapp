/**
 * Validador estricto de magic bytes para evitar ataques de tipo MIME spoofing.
 */

export interface DetectedMime {
  mime: string;
  extension: string;
}

export function detectMagicBytes(buffer: Buffer): DetectedMime | null {
  if (buffer.length < 12) {
    return null;
  }

  // PDF: %PDF- (0x25 0x50 0x44 0x46 0x2D)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  ) {
    return { mime: "application/pdf", extension: "pdf" };
  }

  // JPEG: 0xFF 0xD8 0xFF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", extension: "jpg" };
  }

  // PNG: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mime: "image/png", extension: "png" };
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: "image/webp", extension: "webp" };
  }

  // MP4 / QuickTime: ....ftyp
  if (
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70
  ) {
    return { mime: "video/mp4", extension: "mp4" };
  }

  return null;
}

export function validateMagicBytes(
  buffer: Buffer,
  allowedMimes: string[]
): { valid: boolean; detectedMime: string | null } {
  const detected = detectMagicBytes(buffer);
  if (!detected) {
    return { valid: false, detectedMime: null };
  }
  return {
    valid: allowedMimes.includes(detected.mime),
    detectedMime: detected.mime,
  };
}
