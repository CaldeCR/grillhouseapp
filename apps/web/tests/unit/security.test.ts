import { describe, it, expect } from "vitest";
import { detectMagicBytes, validateMagicBytes } from "@/server/security/magic-bytes";
import { validateAndResolveUrl } from "@/server/security/ssrf-guard";

describe("Validación de Seguridad - Magic Bytes", () => {
  it("detecta correctamente un PDF por magic bytes (%PDF-)", () => {
    const pdfHeader = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x00, 0x00, 0x00]);
    const detected = detectMagicBytes(pdfHeader);
    expect(detected).not.toBeNull();
    expect(detected?.mime).toBe("application/pdf");
    expect(detected?.extension).toBe("pdf");

    const check = validateMagicBytes(pdfHeader, ["application/pdf"]);
    expect(check.valid).toBe(true);
  });

  it("rechaza un archivo con extensión falsa o magic bytes incorrectos", () => {
    const fakeBuffer = Buffer.from("ESTE NO ES UN PDF REALMENTE");
    const check = validateMagicBytes(fakeBuffer, ["application/pdf"]);
    expect(check.valid).toBe(false);
  });
});

describe("Validación de Seguridad - SSRF Guard", () => {
  it("permite dominios sociales permitidos como YouTube", async () => {
    const res = await validateAndResolveUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(res.safe).toBe(true);
    expect(res.normalizedUrl).toContain("youtube.com");
  });

  it("bloquea dominios fuera de la allowlist", async () => {
    const res = await validateAndResolveUrl("https://sitio-malicioso-desconocido.com/exploit");
    expect(res.safe).toBe(false);
    expect(res.error).toContain("no se encuentra en la lista de plataformas permitidas");
  });

  it("bloquea protocolos que no sean http/https", async () => {
    const res = await validateAndResolveUrl("file:///etc/passwd");
    expect(res.safe).toBe(false);
  });
});
