import Link from "next/link";
import { getCourses } from "@/features/courses/queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Calendar, User } from "lucide-react";
import { CourseCreateDialog } from "@/features/courses/components/CourseCreateDialog";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Cursos y Talleres
          </h1>
          <p className="text-sm text-neutral-400">
            Gestiona los programas de asado, academias y materiales de estudio.
          </p>
        </div>
        <CourseCreateDialog />
      </div>

      {courses.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <BookOpen className="mx-auto h-12 w-12 text-neutral-600" />
          <div className="space-y-1">
            <h3 className="font-semibold text-white">No tienes cursos registrados</h3>
            <p className="text-sm text-neutral-400">
              Registra tu primer curso para comenzar a subir manuales y tomar notas ancladas.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="h-full hover:border-ember-600/50 transition-all flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant="default">{course.school}</Badge>
                    <span className="text-xs text-neutral-400">
                      {course._count.materials} PDFs
                    </span>
                  </div>
                  <CardTitle className="line-clamp-1">{course.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1">
                    <User className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{course.instructor}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-neutral-400">
                  {course.description && (
                    <p className="line-clamp-2 text-neutral-300">{course.description}</p>
                  )}
                  {course.startDate && (
                    <div className="flex items-center gap-1.5 pt-2 border-t border-charcoal-700">
                      <Calendar className="h-3.5 w-3.5 text-ember-500" />
                      <span>{new Date(course.startDate).toLocaleDateString("es-ES")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
