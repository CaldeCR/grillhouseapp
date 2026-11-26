import { prisma } from "../db/prisma";
import { JobType, Prisma } from "@prisma/client";

export interface EnqueueJobOptions {
  ownerId: string;
  type: JobType;
  payload: Prisma.InputJsonValue;
  priority?: number;
  scheduledAt?: Date;
}

/**
 * Encola un nuevo trabajo asíncrono en la tabla PostgreSQL 'jobs'.
 * El worker de Python consumirá este job mediante SELECT ... FOR UPDATE SKIP LOCKED.
 */
export async function enqueueJob({
  ownerId,
  type,
  payload,
  priority = 0,
  scheduledAt = new Date(),
}: EnqueueJobOptions) {
  const job = await prisma.job.create({
    data: {
      ownerId,
      type,
      payload,
      priority,
      scheduledAt,
      status: "PENDING",
      attempts: 0,
    },
  });

  return job;
}
