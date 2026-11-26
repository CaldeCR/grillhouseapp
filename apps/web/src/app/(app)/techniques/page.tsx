import Link from "next/link";
import { getTechniques } from "@/features/techniques/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Flame, AlertTriangle, CheckCircle } from "lucide-react";

export default async function TechniquesPage() {
  const techniques = await getTechniques();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Fichas de Técnicas
          </h1>
          <p className="text-sm text-neutral-400">
            Habilidades maestras: control de brasas, fuego indirecto, sellado inverso y ahumado.
          </p>
        </div>
        <Link href="/techniques/new">
          <Button className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Nueva Técnica</span>
          </Button>
        </Link>
      </div>

      {techniques.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <Flame className="mx-auto h-12 w-12 text-neutral-600" />
          <div className="space-y-1">
            <h3 className="font-semibold text-white">No tienes técnicas registradas</h3>
            <p className="text-sm text-neutral-400">
              Registra una técnica aprendida en tus cursos o experimentos personales.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techniques.map((t) => (
            <Card key={t.id} className="h-full flex flex-col justify-between hover:border-ember-600/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge variant="default">Técnica</Badge>
                  {t.originCourse && (
                    <span className="text-xs text-neutral-400 truncate max-w-[120px]">
                      {t.originCourse.name}
                    </span>
                  )}
                </div>
                <CardTitle className="line-clamp-1">{t.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {t.descriptionText && (
                  <p className="line-clamp-2 text-neutral-300">{t.descriptionText}</p>
                )}

                {t.keyPoints.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-neutral-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-emerald-400" /> Puntos clave:
                    </span>
                    <ul className="list-disc list-inside text-neutral-300 pl-1">
                      {t.keyPoints.slice(0, 2).map((kp, idx) => (
                        <li key={idx} className="truncate">{kp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {t.commonErrors.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-neutral-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-400" /> Errores comunes:
                    </span>
                    <ul className="list-disc list-inside text-neutral-400 pl-1">
                      {t.commonErrors.slice(0, 2).map((ce, idx) => (
                        <li key={idx} className="truncate">{ce}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
