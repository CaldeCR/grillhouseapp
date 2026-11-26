import json
from datetime import datetime
from typing import Optional, Dict, Any
from processor.db import get_connection

class JobQueue:
    """
    Gestor de cola de tareas PostgreSQL con bloqueo transaccional concurrente
    mediante SELECT ... FOR UPDATE SKIP LOCKED.
    """

    @staticmethod
    def claim_next_job() -> Optional[Dict[str, Any]]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                # Transacción con FOR UPDATE SKIP LOCKED
                cur.execute(
                    """
                    SELECT id, owner_id, type, payload, attempts, max_attempts
                    FROM jobs
                    WHERE status = 'PENDING'
                      AND scheduled_at <= %s
                    ORDER BY priority DESC, scheduled_at ASC
                    FOR UPDATE SKIP LOCKED
                    LIMIT 1
                    """,
                    (datetime.now(),),
                )
                row = cur.fetchone()
                if not row:
                    return None

                job_id = row["id"]
                # Marcar job como PROCESSING
                cur.execute(
                    """
                    UPDATE jobs
                    SET status = 'PROCESSING',
                        started_at = %s,
                        attempts = attempts + 1,
                        updated_at = %s
                    WHERE id = %s
                    """,
                    (datetime.now(), datetime.now(), job_id),
                )
                conn.commit()
                return dict(row)

    @staticmethod
    def mark_completed(job_id: str, result: Dict[str, Any]):
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE jobs
                    SET status = 'COMPLETED',
                        completed_at = %s,
                        result = %s,
                        updated_at = %s
                    WHERE id = %s
                    """,
                    (datetime.now(), json.dumps(result), datetime.now(), job_id),
                )
                conn.commit()

    @staticmethod
    def mark_failed(job_id: str, error_message: str):
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE jobs
                    SET status = 'FAILED',
                        completed_at = %s,
                        error_message = %s,
                        updated_at = %s
                    WHERE id = %s
                    """,
                    (datetime.now(), error_message, datetime.now(), job_id),
                )
                conn.commit()
