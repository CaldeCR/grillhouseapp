import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/require-user";
import { validateAndResolveUrl } from "@/server/security/ssrf-guard";

export async function POST(req: NextRequest) {
  try {
    await requireUser();
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL requerida" }, { status: 400 });
    }

    const check = await validateAndResolveUrl(url);
    if (!check.safe) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }

    let title: string | null = null;
    let thumbnailUrl: string | null = null;
    let platform = "WEB";

    const parsed = new URL(check.normalizedUrl);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      platform = "YOUTUBE";
      // Intentar oEmbed público de YouTube (sin descargar videos)
      try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
          check.normalizedUrl
        )}&format=json`;
        const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          title = data.title || null;
          thumbnailUrl = data.thumbnail_url || null;
        }
      } catch {
        // Fallback
      }
    } else if (host.includes("instagram.com")) {
      platform = "INSTAGRAM";
      title = "Publicación de Instagram";
    } else if (host.includes("tiktok.com")) {
      platform = "TIKTOK";
      title = "Video de TikTok";
    } else if (host.includes("x.com") || host.includes("twitter.com")) {
      platform = "X";
      title = "Publicación en X";
    }

    return NextResponse.json({
      success: true,
      data: {
        url: check.normalizedUrl,
        platform,
        title,
        thumbnailUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error resolviendo la referencia externa" },
      { status: 500 }
    );
  }
}
