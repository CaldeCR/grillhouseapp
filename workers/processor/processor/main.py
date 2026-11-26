import os
import time
import logging
from processor.queue import JobQueue
from processor.jobs.video_transcode import process_video_transcode
from processor.jobs.pdf_extract import process_pdf_extract

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("worker")

STORAGE_ROOT = os.getenv("STORAGE_LOCAL_ROOT", os.path.abspath("../../uploads_data"))
POLL_INTERVAL = float(os.getenv("WORKER_POLL_INTERVAL_SECONDS", "2"))

def run_worker():
    logger.info(f"Worker de procesamiento iniciado. Raíz de almacenamiento: {STORAGE_ROOT}")

    while True:
        try:
            job = JobQueue.claim_next_job()
            if not job:
                time.sleep(POLL_INTERVAL)
                continue

            job_id = job["id"]
            job_type = job["type"]
            payload = job["payload"]
            logger.info(f"Procesando job {job_id} de tipo {job_type}")

            if job_type == "VIDEO_TRANSCODE":
                result = process_video_transcode(payload, STORAGE_ROOT)
                JobQueue.mark_completed(job_id, result)
                logger.info(f"Job {job_id} completado con éxito.")
            elif job_type == "PDF_EXTRACT":
                result = process_pdf_extract(payload, STORAGE_ROOT)
                JobQueue.mark_completed(job_id, result)
                logger.info(f"Job PDF {job_id} procesado.")
            else:
                raise ValueError(f"Tipo de job no soportado: {job_type}")

        except Exception as e:
            logger.exception(f"Error procesando job: {e}")
            if 'job' in locals() and job:
                JobQueue.mark_failed(job["id"], str(e))
            time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    run_worker()
