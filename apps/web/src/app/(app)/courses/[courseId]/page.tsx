import { notFound } from "next/navigation";
import { getCourseById } from "@/features/courses/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, User, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import { MaterialUploadDialog } from "@/features/materials/components/MaterialUploadDialog";

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourseById(params.courseId);
  if (!course) notFound();

  return (
    <div className="space-y-6">
      {/* Header del Curso */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="default">{course.school}</Badge>
          {course.startDate && (
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(course.startDate).toLocaleDateString("es-ES")}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{course.name}</h1>
        <p className="text-sm text-neutral-400 flex items-center gap-1.5">
          <User className="h-4 w-4 text-ember-500" />
          <span>Instructor: {course.instructor}</span>
        </p>
        {course.description && (
          <p className="text-sm text-neutral-300 pt-2">{course.description}</p>
        )}
      </div>

      {/* Manuales y PDFs del Curso */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-ember-500" />
            Materiales y PDFs de Estudio ({course.materials.length})
          </h2>
          <MaterialUploadDialog courseId={course.id} />
        </div>

        {course.materials.length === 0 ? (
          <Card className="p-8 text-center text-sm text-neutral-400 space-y-2">
            <p>No hay PDFs subidos para este curso.</p>
            <p className="text-xs text-neutral-500">
              Sube los manuales oficiales del curso para leerlos y anclar notas de estudio.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {course.materials.map((m) => (
              <Link
                key={m.id}
                href={`/courses/${course.id}/materials/${m.id}`}
                className="group"
              >
                <Card className="p-4 hover:border-ember-600/50 transition-colors flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium text-white group-hover:text-ember-400 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Autor: {m.sourceAuthor || course.instructor} • {(m.fileSize / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Ver PDF
                  </Badge>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recetas vinculadas al curso */}
      {course.recipes.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-charcoal-700">
          <h2 className="text-lg font-semibold text-white">Recetas del Curso</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {course.recipes.map((r) => (
              <Link key={r.id} href={`/recipes/${r.id}`}>
                <Card className="p-3 hover:border-charcoal-600">
                  <span className="font-medium text-sm text-neutral-200">{r.title}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
