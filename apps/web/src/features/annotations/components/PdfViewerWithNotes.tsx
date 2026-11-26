"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createAnnotationAction, deleteAnnotationAction } from "../actions";
import { Bookmark, Trash2, Plus, MessageSquare } from "lucide-react";

interface AnnotationItem {
  id: string;
  pageNumber: number;
  type: string;
  position: any;
  quoteText: string | null;
  comment: string | null;
  color: string | null;
}

export function PdfViewerWithNotes({
  materialId,
  fileUrl,
  initialAnnotations,
}: {
  materialId: string;
  fileUrl: string;
  initialAnnotations: AnnotationItem[];
}) {
  const [annotations, setAnnotations] = useState<AnnotationItem[]>(initialAnnotations);
  const [selectedPage, setSelectedPage] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [activeColor, setActiveColor] = useState("#ffd700");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAnnotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText && !quoteText) return;

    setIsSubmitting(true);
    try {
      const newAnno = await createAnnotationAction({
        materialId,
        pageNumber: selectedPage,
        type: "HIGHLIGHT",
        position: {
          pageNumber: selectedPage,
          boundingRect: { x1: 50, y1: 100, x2: 300, y2: 150, width: 600, height: 800 },
          rects: [{ x1: 50, y1: 100, x2: 300, y2: 150, width: 600, height: 800 }],
        },
        quoteText: quoteText || null,
        comment: commentText || null,
        color: activeColor,
      });

      if (newAnno.annotation) {
        setAnnotations([...annotations, newAnno.annotation as unknown as AnnotationItem]);
      }
      setCommentText("");
      setQuoteText("");
    } catch (err: any) {
      alert(err.message || "Error al anclar nota");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnotationAction(id);
      setAnnotations(annotations.filter((a) => a.id !== id));
    } catch {
      alert("Error al eliminar nota");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {/* Visor PDF (Mobile iframe / embed responsive) */}
      <div className="md:col-span-2 flex flex-col h-full rounded-xl border border-charcoal-700 bg-charcoal-900 overflow-hidden shadow-lg">
        <div className="flex items-center justify-between bg-charcoal-800 px-4 py-2 border-b border-charcoal-700">
          <span className="text-xs text-neutral-300 font-medium">Visor PDF Autenticado</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Página activa para notas:</span>
            <input
              type="number"
              min={1}
              value={selectedPage}
              onChange={(e) => setSelectedPage(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 rounded bg-charcoal-900 px-2 py-0.5 text-xs text-white border border-charcoal-700 text-center"
            />
          </div>
        </div>
        <div className="flex-1 w-full h-[55vh] md:h-full bg-neutral-900 relative">
          <iframe
            src={`${fileUrl}#page=${selectedPage}&view=FitH`}
            className="w-full h-full border-none"
            title="Visor PDF"
          />
        </div>
      </div>

      {/* Sidebar de Notas Ancladas */}
      <div className="flex flex-col h-full rounded-xl border border-charcoal-700 bg-charcoal-900 p-4 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-charcoal-700 pb-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-ember-500" />
            Notas Ancladas ({annotations.length})
          </h2>
        </div>

        {/* Formulario para anclar nota */}
        <form onSubmit={handleAddAnnotation} className="space-y-3 bg-charcoal-800/60 p-3 rounded-lg border border-charcoal-700">
          <div className="text-xs font-semibold text-neutral-300">
            Nueva Nota (Pág. {selectedPage})
          </div>
          <Input
            placeholder="Texto citado del PDF (opcional)"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            className="text-xs h-8"
          />
          <Input
            placeholder="Tu comentario o clave técnica"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="text-xs h-8"
            required
          />
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1.5">
              {["#ffd700", "#ff6b6b", "#4dabf7", "#51cf66"].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setActiveColor(c)}
                  className={`h-4 w-4 rounded-full border ${activeColor === c ? "ring-2 ring-white" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <Button size="sm" type="submit" disabled={isSubmitting} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Anclar
            </Button>
          </div>
        </form>

        {/* Lista de notas ancladas */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {annotations.length === 0 ? (
            <div className="text-center py-6 text-xs text-neutral-500">
              No hay notas registradas para este documento.
            </div>
          ) : (
            annotations.map((anno) => (
              <Card
                key={anno.id}
                className="p-3 text-xs space-y-1.5 border-l-4"
                style={{ borderLeftColor: anno.color || "#ffd700" }}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    Pág. {anno.pageNumber}
                  </Badge>
                  <button
                    onClick={() => handleDelete(anno.id)}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {anno.quoteText && (
                  <p className="italic text-neutral-400 line-clamp-2">
                    &ldquo;{anno.quoteText}&rdquo;
                  </p>
                )}
                {anno.comment && (
                  <p className="font-medium text-neutral-200">
                    {anno.comment}
                  </p>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
