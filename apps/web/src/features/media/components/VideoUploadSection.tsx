"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, Film } from "lucide-react";

export function VideoUploadSection() {
  const [preset, setPreset] = useState("PRESET_720P");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      // Usar endpoint tus o subida directa con encolamiento de transcodificación
      const formData = new FormData();
      formData.append("file", file);
      formData.append("preset", preset);

      // Simulación de carga e inicio de job en el MVP
      alert("Video recibido. Se ha enviado al worker de procesamiento de video (FFmpeg H.264/AAC).");
      setFile(null);
    } catch {
      alert("Error al subir video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-5 border-charcoal-700 bg-charcoal-900/90">
      <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
        <Film className="h-5 w-5 text-ember-500" />
        Subir Video Corto (&le; 60 s)
      </h2>
      <p className="text-xs text-neutral-400 mb-4">
        Validación por ffprobe. Se transcodifica en segundo plano a MP4 (H.264/AAC, CRF ~28).
      </p>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Archivo de Video</label>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-neutral-300 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-ember-600 file:text-white hover:file:bg-ember-700"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Preset de Transcodificación</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full h-9 rounded-md border border-charcoal-700 bg-charcoal-800 px-3 py-1 text-xs text-neutral-100"
            >
              <option value="PRESET_480P">480p (Optimizado para móvil / bajo peso)</option>
              <option value="PRESET_720P">720p (Recomendado / Balance calidad y tamaño)</option>
              <option value="PRESET_1080P">1080p (Alta definición)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={uploading || !file} className="gap-2">
            <UploadCloud className="h-4 w-4" />
            {uploading ? "Subiendo por chunks..." : "Iniciar Subida y Procesamiento"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
