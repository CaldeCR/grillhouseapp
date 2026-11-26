import os
import subprocess
import json
from typing import Dict, Any, Tuple

MAX_DURATION_SECONDS = 60.0

RESOLUTION_PRESETS = {
    "PRESET_480P": ("854", "480"),
    "PRESET_720P": ("1280", "720"),
    "PRESET_1080P": ("1920", "1080"),
}

def inspect_video_with_ffprobe(file_path: str) -> Tuple[float, int, int]:
    """
    Obtiene la duración, ancho y alto exactos de un archivo de video usando ffprobe.
    """
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration:stream=width,height",
        "-of", "json",
        file_path,
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    metadata = json.loads(result.stdout)

    duration = float(metadata.get("format", {}).get("duration", 0.0))
    streams = metadata.get("streams", [])
    width = 0
    height = 0
    for s in streams:
        if "width" in s and "height" in s:
            width = s["width"]
            height = s["height"]
            break

    return duration, width, height

def process_video_transcode(payload: Dict[str, Any], storage_root: str) -> Dict[str, Any]:
    """
    Transcodifica un video a MP4 (H.264 / AAC, CRF ~28, preset veryfast)
    y genera una miniatura en el segundo 1.0.
    """
    input_key = payload["inputKey"]
    preset = payload.get("preset", "PRESET_720P")
    input_path = os.path.join(storage_root, input_key)

    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Archivo de video de entrada no encontrado: {input_path}")

    # 1. Validación de duración <= 60s
    duration, orig_w, orig_h = inspect_video_with_ffprobe(input_path)
    if duration > MAX_DURATION_SECONDS:
        raise ValueError(
            f"El video dura {duration:.1f} s, excediendo el límite máximo de {MAX_DURATION_SECONDS} s."
        )

    # 2. Configurar resolución según preset
    target_w, target_h = RESOLUTION_PRESETS.get(preset, ("1280", "720"))
    scale_filter = f"scale='min({target_w},iw)':-2"

    base_name, _ = os.path.splitext(input_key)
    output_key = f"{base_name}_transcoded_{preset.lower()}.mp4"
    thumbnail_key = f"{base_name}_thumb.jpg"

    output_path = os.path.join(storage_root, output_key)
    thumbnail_path = os.path.join(storage_root, thumbnail_key)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 3. Transcodificación con ffmpeg (H.264 / AAC, CRF 28, veryfast)
    ffmpeg_cmd = [
        "ffmpeg",
        "-y",
        "-i", input_path,
        "-vf", scale_filter,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "28",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        output_path,
    ]
    subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # 4. Generación de miniatura en el segundo 1.0 (o 0.0 si es muy corto)
    thumb_time = "00:00:01" if duration >= 1.0 else "00:00:00"
    thumb_cmd = [
        "ffmpeg",
        "-y",
        "-ss", thumb_time,
        "-i", input_path,
        "-vframes", "1",
        "-q:v", "2",
        thumbnail_path,
    ]
    subprocess.run(thumb_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    return {
        "outputKey": output_key,
        "thumbnailKey": thumbnail_key,
        "durationSeconds": duration,
        "width": int(target_w),
        "height": int(target_h),
    }
