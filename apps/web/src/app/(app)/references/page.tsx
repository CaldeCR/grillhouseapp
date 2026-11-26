import { getReferences } from "@/features/references/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, ExternalLink } from "lucide-react";
import { ReferenceDialog } from "@/features/references/components/ReferenceDialog";

export default async function ReferencesPage() {
  const references = await getReferences();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Referencias de Redes Sociales
          </h1>
          <p className="text-sm text-neutral-400">
            Enlaces a YouTube, Instagram, TikTok o X protegidos con allowlist y anti-SSRF.
          </p>
        </div>
        <ReferenceDialog />
      </div>

      {references.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <Share2 className="mx-auto h-12 w-12 text-neutral-600" />
          <div className="space-y-1">
            <h3 className="font-semibold text-white">No hay referencias guardadas</h3>
            <p className="text-sm text-neutral-400">
              Agrega enlaces de YouTube, Instagram o TikTok para complementar tus recetas.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {references.map((ref) => (
            <Card key={ref.id} className="overflow-hidden flex flex-col justify-between">
              {ref.thumbnailUrl && (
                <div className="h-40 w-full overflow-hidden bg-neutral-900 relative">
                  <img
                    src={ref.thumbnailUrl}
                    alt={ref.title || "Referencia"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="default">{ref.platform}</Badge>
                  </div>
                </div>
              )}
              <CardContent className="p-4 space-y-2">
                {!ref.thumbnailUrl && (
                  <Badge variant="secondary" className="mb-2">
                    {ref.platform}
                  </Badge>
                )}
                <h3 className="font-semibold text-white line-clamp-2">
                  {ref.title || ref.url}
                </h3>
                {ref.notes && (
                  <p className="text-xs text-neutral-400 line-clamp-3">{ref.notes}</p>
                )}
                <div className="pt-2 flex items-center justify-between border-t border-charcoal-700">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-xs text-ember-400 hover:underline"
                  >
                    <span>Abrir en {ref.platform}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
