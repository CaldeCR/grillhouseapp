import os
import psycopg
from psycopg.rows import dict_row

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres_secure_pass@localhost:5432/bitacora_asados?schema=public",
)

def get_connection():
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)
