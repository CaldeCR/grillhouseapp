"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createTechniqueAction } from "@/features/techniques/actions";
import { Plus, Trash2 } from "lucide-react";

export default function NewTechniquePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>(["Mantener flujo constante de oxígeno"]);
  const [commonErrors, setCommonErrors] = useState<string[]>(["Poner la carne con brasa aún negra (humo amargo)"]);

  const handleAddKeyPoint = () => setKeyPoints([...keyPoints, ""]);
  const handleAddCommonError = () => setCommonErrors([...commonErrors, ""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTechniqueAction({
        name,
        descriptionText,
        keyPoints: keyPoints.filter((k) => k.trim().length > 0),
        commonErrors: commonErrors.filter((c) => c.trim().length > 0),
      });

      router.push("/techniques");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error al registrar la técnica");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Registrar Nueva Técnica
        </h1>
        <p className="text-sm text-neutral-400">
          Documenta los puntos críticos de éxito y los errores a evitar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-5 space-y-4">
          <div>
            <label className="text-xs text-neutral-400">Nombre de la Técnica</label>
            <Input
              required
              placeholder="ej. Sellado Inverso (Reverse Sear)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400">Descripción Detallada</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 p-3 text-sm text-neutral-100 placeholder:text-neutral-500"
              placeholder="Explicación del fundamento térmico, cómo aplicarlo en cortes gruesos..."
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
            />
          </div>
        </Card>

        {/* Puntos Clave */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Puntos Clave de Éxito</h2>
            <Button type="button" size="sm" variant="secondary" onClick={handleAddKeyPoint}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Agregar
            </Button>
          </div>
          <div className="space-y-2">
            {keyPoints.map((kp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={kp}
                  onChange={(e) => {
                    const copy = [...keyPoints];
                    copy[idx] = e.target.value;
                    setKeyPoints(copy);
                  }}
                  placeholder="ej. Esperar a que la temperatura interna llegue a 45°C antes de sellar"
                />
                <button
                  type="button"
                  onClick={() => setKeyPoints(keyPoints.filter((_, i) => i !== idx))}
                  className="text-neutral-500 hover:text-red-400 p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Errores Comunes */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Errores Comunes</h2>
            <Button type="button" size="sm" variant="secondary" onClick={handleAddCommonError}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Agregar
            </Button>
          </div>
          <div className="space-y-2">
            {commonErrors.map((ce, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={ce}
                  onChange={(e) => {
                    const copy = [...commonErrors];
                    copy[idx] = e.target.value;
                    setCommonErrors(copy);
                  }}
                  placeholder="ej. Sellar con la carne húmeda (impide reacción de Maillard óptima)"
                />
                <button
                  type="button"
                  onClick={() => setCommonErrors(commonErrors.filter((_, i) => i !== idx))}
                  className="text-neutral-500 hover:text-red-400 p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Técnica"}
          </Button>
        </div>
      </form>
    </div>
  );
}
