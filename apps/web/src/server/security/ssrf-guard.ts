import dns from "node:dns/promises";

// Dominios permitidos para referencias sociales y enriquecimiento
export const ALLOWED_SOCIAL_DOMAINS = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "instagram.com",
  "www.instagram.com",
  "tiktok.com",
  "www.tiktok.com",
  "x.com",
  "www.x.com",
  "twitter.com",
  "www.twitter.com",
];

function isPrivateIp(ip: string): boolean {
  // IPv4 Loopback (127.0.0.0/8)
  if (ip.startsWith("127.")) return true;

  // IPv4 Private Class A: 10.0.0.0/8
  if (ip.startsWith("10.")) return true;

  // IPv4 Private Class B: 172.16.0.0/12
  const matchB = ip.match(/^172\.(\d+)\./);
  if (matchB) {
    const secondOctet = parseInt(matchB[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) return true;
  }

  // IPv4 Private Class C: 192.168.0.0/16
  if (ip.startsWith("192.168.")) return true;

  // Link-Local (169.254.0.0/16)
  if (ip.startsWith("169.254.")) return true;

  // IPv6 Loopback y Private
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") return true;
  if (ip.toLowerCase().startsWith("fe80:")) return true; // Link-local
  if (ip.toLowerCase().startsWith("fc00:") || ip.toLowerCase().startsWith("fd00:")) return true; // Unique local

  return false;
}

export async function validateAndResolveUrl(inputUrl: string): Promise<{
  safe: boolean;
  normalizedUrl: string;
  error?: string;
}> {
  let parsed: URL;
  try {
    parsed = new URL(inputUrl);
  } catch {
    return { safe: false, normalizedUrl: inputUrl, error: "URL inválida" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { safe: false, normalizedUrl: inputUrl, error: "Protocolo no soportado (solo http/https)" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Verificar allowlist
  const isAllowedDomain = ALLOWED_SOCIAL_DOMAINS.some(
    (d) => hostname === d || hostname.endsWith(`.${d}`)
  );

  if (!isAllowedDomain) {
    return {
      safe: false,
      normalizedUrl: inputUrl,
      error: `El dominio '${hostname}' no se encuentra en la lista de plataformas permitidas.`,
    };
  }

  // Resolución DNS preventiva contra SSRF (Rebinding & Private IP resolution)
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    for (const addr of addresses) {
      if (isPrivateIp(addr.address)) {
        return {
          safe: false,
          normalizedUrl: inputUrl,
          error: "Acceso bloqueado a dirección IP interna o privada (protección SSRF).",
        };
      }
    }
  } catch {
    return {
      safe: false,
      normalizedUrl: inputUrl,
      error: "No se pudo resolver el nombre de dominio DNS.",
    };
  }

  return { safe: true, normalizedUrl: parsed.toString() };
}
