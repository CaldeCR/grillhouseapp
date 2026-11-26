from typing import Dict, Any
import fitz # PyMuPDF

def process_pdf_extract(payload: Dict[str, Any], storage_root: str) -> Dict[str, Any]:
    """
    Job de extracción de PDF (Fase 2).
    Prepara la estructura para Docling / PyMuPDF para extraer fichas automáticamente.
    """
    input_key = payload.get("inputKey", "")
    return {
        "status": "ready_for_phase_2",
        "message": "Tipo de job pdf_extract registrado correctamente. La extracción automática se activará en fase 2.",
        "inputKey": input_key,
    }
