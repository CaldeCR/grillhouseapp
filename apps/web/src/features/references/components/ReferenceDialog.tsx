"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReferenceAction } from "../actions";
import { Plus, Link2 } from "lucide-react";

export function ReferenceDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState<{ title?: string; thumbnailUrl?: string; platform?: string } | null>(null);

  const handleResolveUrl = async () => {
    if (!url) return;
    try {
      const res = await fetch("/api/og/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setPreview(data.data);
      } else {
        alert(data.error || "No se pudo resolver la URL");
      }
    } catch {
      alert("Error al resolver la previsualización");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReferenceAction({
        url,
        // @ts-expect-error enum check
        platform: preview?.platform || "WEB",
        title: preview?.title || url,
        notes: notes || null,
        thumbnailUrl: preview?.thumbnailUrl || null,
        isManualThumbnail: false,
      });
      setOpen(false);
      setUrl("");
      setNotes("");
      setPreview(null);
    } catch (err: any) {
      alert(err.message || "Error al guardar referencia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-1.5">
        <Plus className="h-4 w-4" />
        <span>Nueva Referencia</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-charcoal-700 bg-charcoal-900 p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Guardar Referencia de Redes</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400">URL (YouTube, Instagram, TikTok, X)</label>
                <div className="flex gap-2">
                  <Input
                    required
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button type="button" variant="secondary" onClick={handleResolveUrl}>
                    Verificar
                  </Button>
                </div>
              </div>

              {preview && (
                <div className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-3 space-y-2">
                  <span className="text-[10px] uppercase font-semibold text-ember-400">
                    Plataforma: {preview.platform}
                  </span>
                  {preview.title && (
                    <p className="text-xs font-medium text-white">{preview.title}</p>
                  )}
                  {preview.thumbnailUrl && (
                    <img
                      src={preview.thumbnailUrl}
                      alt="Miniatura"
                      className="h-24 w-full object-cover rounded"
                    />
                  )}
                </div>
              )}

              <div>
                <label className="text-xs text-neutral-400">Notas Personales</label>
                <textarea
                  className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 p-2 text-sm text-neutral-100 placeholder:text-neutral-500"
                  rows={3}
                  placeholder="Observaciones sobre la técnica de sellado vista en el video..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || !url}>
                  {loading ? "Guardando..." : "Guardar Referencia"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
