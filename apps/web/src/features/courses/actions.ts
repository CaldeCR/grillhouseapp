"use server";

import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db/prisma";
import { CourseSchema, CourseInput, ClassSessionSchema, ClassSessionInput } from "./schema";
import { revalidatePath } from "next/cache";

export async function createCourseAction(data: CourseInput) {
  const user = await requireUser();
  const parsed = CourseSchema.parse(data);

  const course = await prisma.course.create({
    data: {
      ownerId: user.id,
      name: parsed.name,
      school: parsed.school,
      instructor: parsed.instructor,
      startDate: parsed.startDate ? new Date(parsed.startDate) : null,
      endDate: parsed.endDate ? new Date(parsed.endDate) : null,
      description: parsed.description,
    },
  });

  revalidatePath("/courses");
  return { success: true, course };
}

export async function updateCourseAction(id: string, data: Partial<CourseInput>) {
  const user = await requireUser();
  const course = await prisma.course.update({
    where: { id, ownerId: user.id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });

  revalidatePath("/courses");
  revalidatePath(`/courses/${id}`);
  return { success: true, course };
}

export async function deleteCourseAction(id: string) {
  const user = await requireUser();
  await prisma.course.delete({
    where: { id, ownerId: user.id },
  });

  revalidatePath("/courses");
  return { success: true };
}

export async function createClassSessionAction(data: ClassSessionInput) {
  const user = await requireUser();
  const parsed = ClassSessionSchema.parse(data);

  // Validar pertenencia del curso
  const course = await prisma.course.findFirst({
    where: { id: parsed.courseId, ownerId: user.id },
  });
  if (!course) throw new Error("Curso no encontrado");

  const session = await prisma.classSession.create({
    data: {
      ownerId: user.id,
      courseId: parsed.courseId,
      sessionNumber: parsed.sessionNumber,
      title: parsed.title,
      date: parsed.date ? new Date(parsed.date) : null,
      notes: parsed.notes,
    },
  });

  revalidatePath(`/courses/${parsed.courseId}`);
  return { success: true, session };
}
