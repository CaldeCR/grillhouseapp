"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadPdfMaterialAction } from "../actions";
import { UploadCloud } from "lucide-react";

export function MaterialUploadDialog({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [sourceAuthor, setSourceAuthor] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", courseId);
      formData.append("title", title || file.name);
      formData.append("sourceAuthor", sourceAuthor);

      await uploadPdfMaterialAction(formData);
      setOpen(false);
      setTitle("");
      setSourceAuthor("");
      setFile(null);
    } catch (err: any) {
      alert(err.message || "Error al subir PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5">
        <UploadCloud className="h-4 w-4" />
        <span>Subir PDF</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-charcoal-700 bg-charcoal-900 p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Subir Documento PDF</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400">Título del Documento</label>
                <Input
                  placeholder="ej. Manual de Cocción Lenta y Salmueras"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Autor / Fuente</label>
                <Input
                  placeholder="ej. Academia Mexicana de Asados"
                  value={sourceAuthor}
                  onChange={(e) => setSourceAuthor(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Archivo PDF</label>
                <input
                  type="file"
                  required
                  accept="application/pdf"
                  className="w-full text-xs text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-ember-600 file:text-white hover:file:bg-ember-700"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || !file}>
                  {loading ? "Subiendo y validando..." : "Subir PDF"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
