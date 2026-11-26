"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createRecipeAction } from "../actions";
import { Plus, Trash2, Flame } from "lucide-react";

interface RecipeFormProps {
  courses: Array<{ id: string; name: string }>;
  techniques: Array<{ id: string; name: string }>;
}

export function RecipeForm({ courses, techniques }: RecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [portions, setPortions] = useState<number | undefined>(4);
  const [ingredients, setIngredients] = useState<Array<{ amount: number; unit: string; name: string }>>([
    { amount: 1, unit: "kg", name: "Picaña o Corte de Res" },
    { amount: 30, unit: "g", name: "Sal de grano o Sal marina" },
  ]);
  const [stepsText, setStepsText] = useState("");
  const [targetCoreTemp, setTargetCoreTemp] = useState("54°C");
  const [smokerTemp, setSmokerTemp] = useState("110°C");
  const [originCourseId, setOriginCourseId] = useState("");
  const [originPage, setOriginPage] = useState<number | undefined>();
  const [originAuthor, setOriginAuthor] = useState("");
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { amount: 1, unit: "pz", name: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const updated = [...ingredients];
    // @ts-expect-error dynamic access
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Formato JSON tipo TipTap básico para AST y texto plano derivado
      const tipTapJson = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: stepsText }],
          },
        ],
      };

      await createRecipeAction({
        title,
        portions: portions ? Number(portions) : undefined,
        ingredients: ingredients.map((i) => ({ ...i, amount: Number(i.amount) })),
        stepsContent: tipTapJson,
        stepsText,
        temperatures: {
          targetCoreTemp,
          smokerTemp,
        },
        originCourseId: originCourseId || null,
        originPage: originPage ? Number(originPage) : null,
        originAuthor: originAuthor || null,
        techniqueIds: selectedTechniques,
      });

      router.push("/recipes");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error al crear la receta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-5 space-y-4">
        <h2 className="text-base font-semibold text-white">Datos Principales</h2>
        <div>
          <label className="text-xs text-neutral-400">Título de la Receta</label>
          <Input
            required
            placeholder="ej. Brisket Texas Style a la Pimienta Negra"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-400">Porciones Estimadas</label>
            <Input
              type="number"
              min={1}
              value={portions ?? ""}
              onChange={(e) => setPortions(e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Curso de Origen (opcional)</label>
            <select
              className="w-full h-10 rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-2 text-sm text-neutral-100"
              value={originCourseId}
              onChange={(e) => setOriginCourseId(e.target.value)}
            >
              <option value="">Ninguno</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Ingredientes Estructurados */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Ingredientes (Estructurados)</h2>
          <Button type="button" size="sm" variant="secondary" onClick={handleAddIngredient}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                type="number"
                step="any"
                className="w-20"
                value={ing.amount}
                onChange={(e) => handleIngredientChange(idx, "amount", e.target.value)}
                placeholder="Cant."
              />
              <Input
                className="w-24"
                value={ing.unit}
                onChange={(e) => handleIngredientChange(idx, "unit", e.target.value)}
                placeholder="Unidad (g, kg)"
              />
              <Input
                className="flex-1"
                value={ing.name}
                onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                placeholder="Nombre del ingrediente"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(idx)}
                className="text-neutral-500 hover:text-red-400 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Pasos de Preparación (TipTap / Texto) */}
      <Card className="p-5 space-y-4">
        <h2 className="text-base font-semibold text-white">Pasos de Preparación</h2>
        <textarea
          rows={6}
          required
          className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 p-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-ember-500"
          placeholder="Describe el proceso paso a paso: preparación de la carne, aplicación del rub, control de temperatura..."
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
        />
      </Card>

      {/* Tiempos y Temperaturas */}
      <Card className="p-5 space-y-4">
        <h2 className="text-base font-semibold text-white">Temperaturas Clave</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-400">Temperatura Interna Objetivo</label>
            <Input
              placeholder="ej. 54°C (Medio) o 93°C (Brisket)"
              value={targetCoreTemp}
              onChange={(e) => setTargetCoreTemp(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Temperatura de Parrilla / Ahumador</label>
            <Input
              placeholder="ej. 110°C - 120°C"
              value={smokerTemp}
              onChange={(e) => setSmokerTemp(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando Receta..." : "Publicar Receta"}
        </Button>
      </div>
    </form>
  );
}
