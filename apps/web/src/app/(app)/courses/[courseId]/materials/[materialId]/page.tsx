import { notFound } from "next/navigation";
import { getMaterialById } from "@/features/materials/queries";
import { PdfViewerWithNotes } from "@/features/annotations/components/PdfViewerWithNotes";

export default async function MaterialViewerPage({
  params,
}: {
  params: { courseId: string; materialId: string };
}) {
  const material = await getMaterialById(params.materialId);
  if (!material) notFound();

  const fileUrl = `/api/files/${encodeURIComponent(material.storageKey)}`;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-3rem)]">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-700">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white line-clamp-1">
            {material.title}
          </h1>
          <p className="text-xs text-neutral-400">
            Curso: {material.course.name} • Autor: {material.sourceAuthor || material.course.instructor}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 pt-3">
        <PdfViewerWithNotes
          materialId={material.id}
          fileUrl={fileUrl}
          initialAnnotations={material.annotations}
        />
      </div>
    </div>
  );
}
