#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="${POSTGRES_DB:-bitacora_asados}"
DB_USER="${POSTGRES_USER:-postgres}"
CONTAINER_NAME="bitacora_postgres"

mkdir -p "${BACKUP_DIR}"

echo "[Backup] Iniciando respaldo de PostgreSQL: ${DB_NAME} a las ${TIMESTAMP}..."
docker exec -t "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -F c "${DB_NAME}" > "${BACKUP_DIR}/db_${DB_NAME}_${TIMESTAMP}.dump"
echo "[Backup] Respaldo de base de datos generado en: ${BACKUP_DIR}/db_${DB_NAME}_${TIMESTAMP}.dump"

echo "[Backup] Respaldando archivos subidos..."
tar -czf "${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz" -C /data/uploads . || true
echo "[Backup] Respaldo finalizado correctamente."
