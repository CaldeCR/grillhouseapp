import { getMediaList, getRecentJobs } from "@/features/media/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { VideoUploadSection } from "@/features/media/components/VideoUploadSection";

export default async function MediaPage() {
  const [mediaList, recentJobs] = await Promise.all([
    getMediaList(),
    getRecentJobs(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Videos y Multimedia
          </h1>
          <p className="text-sm text-neutral-400">
            Videos propios &le; 60 s subidos por tus y transcodificados a MP4 H.264/AAC.
          </p>
        </div>
      </div>

      {/* Subidor de Videos con preset */}
      <VideoUploadSection />

      {/* Cola de Jobs en Tiempo Real */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-ember-500" />
          Estado de Procesamiento de Trabajos ({recentJobs.length})
        </h2>

        {recentJobs.length === 0 ? (
          <Card className="p-6 text-center text-xs text-neutral-500">
            No hay trabajos en cola ni ejecutados recientemente.
          </Card>
        ) : (
          <div className="space-y-2">
            {recentJobs.map((job) => {
              const statusBadge = {
                PENDING: <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> En espera</Badge>,
                PROCESSING: <Badge variant="warning"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Procesando</Badge>,
                COMPLETED: <Badge variant="success"><CheckCircle2 className="h-3 w-3 mr-1" /> Completado</Badge>,
                FAILED: <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Falló</Badge>,
              }[job.status];

              return (
                <Card key={job.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-neutral-300 font-semibold">{job.type}</span>
                      {statusBadge}
                    </div>
                    <span className="text-neutral-500 text-[11px]">
                      ID: {job.id} • Creado: {new Date(job.createdAt).toLocaleTimeString()}
                    </span>
                    {job.errorMessage && (
                      <p className="text-red-400 text-[11px]">{job.errorMessage}</p>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    Intentos: {job.attempts}/{job.maxAttempts}
                  </span>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Galería de Videos Listos */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white">Galería de Videos Propios</h2>
        {mediaList.length === 0 ? (
          <Card className="p-8 text-center text-xs text-neutral-500">
            No tienes videos registrados aún.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mediaList.map((media) => (
              <Card key={media.id} className="overflow-hidden">
                <div className="h-44 bg-black flex items-center justify-center relative">
                  {media.transcodingStatus === "READY" ? (
                    <video
                      controls
                      className="h-full w-full object-contain"
                      src={`/api/files/${encodeURIComponent(media.storageKey)}`}
                    />
                  ) : (
                    <div className="text-center p-4 text-xs text-neutral-400">
                      <Film className="h-8 w-8 mx-auto mb-2 text-neutral-600" />
                      <span>{media.transcodingStatus === "PROCESSING" ? "Transcodificando..." : "En espera de worker"}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-xs text-white truncate">{media.originalName}</h3>
                    <Badge variant="outline" className="text-[10px]">
                      {media.videoPreset || "720p"}
                    </Badge>
                  </div>
                  {media.durationSeconds && (
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Duración: {media.durationSeconds.toFixed(1)}s
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
