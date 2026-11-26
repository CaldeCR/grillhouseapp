import pytest
from processor.jobs.video_transcode import MAX_DURATION_SECONDS, RESOLUTION_PRESETS

def test_constants():
    assert MAX_DURATION_SECONDS == 60.0
    assert "PRESET_480P" in RESOLUTION_PRESETS
    assert "PRESET_720P" in RESOLUTION_PRESETS
    assert "PRESET_1080P" in RESOLUTION_PRESETS
    assert RESOLUTION_PRESETS["PRESET_720P"] == ("1280", "720")
