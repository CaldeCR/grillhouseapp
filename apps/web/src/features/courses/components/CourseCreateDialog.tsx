"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCourseAction } from "../actions";
import { Plus } from "lucide-react";

export function CourseCreateDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    instructor: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCourseAction(formData);
      setOpen(false);
      setFormData({
        name: "",
        school: "",
        instructor: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    } catch (err: any) {
      alert(err.message || "Error al crear curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-1.5">
        <Plus className="h-4 w-4" />
        <span>Nuevo Curso</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-charcoal-700 bg-charcoal-900 p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Registrar Nuevo Curso</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400">Nombre del Curso</label>
                <Input
                  required
                  placeholder="ej. Taller de Ahumado y Cortes Finos"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Escuela / Academia</label>
                <Input
                  required
                  placeholder="ej. Sociedad Mexicana de Parrilleros"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Instructor</label>
                <Input
                  required
                  placeholder="ej. Chef Alejandro Gutiérrez"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-400">Fecha Inicio</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Fecha Fin</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-400">Descripción / Objetivos</label>
                <textarea
                  className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 p-2 text-sm text-neutral-100 placeholder:text-neutral-500"
                  rows={3}
                  placeholder="Técnicas de fuego indirecto, calibración de termómetros..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Crear Curso"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
