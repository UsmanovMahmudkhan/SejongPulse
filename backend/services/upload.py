"""
services/upload.py — Cloudinary upload signature service
Generates signed upload parameters. The API secret never reaches the browser.
"""
import os
import time
import hashlib
import logging

logger = logging.getLogger(__name__)

CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")


def generate_upload_signature(folder: str = "pulses", public_id: str | None = None) -> dict:
    """
    Generates a signed upload signature for direct browser-to-Cloudinary uploads.
    The frontend sends this signature with its upload — the secret never leaves the backend.
    """
    timestamp = int(time.time())

    params_to_sign: dict = {"timestamp": timestamp, "folder": folder}
    if public_id:
        params_to_sign["public_id"] = public_id

    # Build canonical param string (sorted alphabetically)
    param_string = "&".join(
        f"{k}={v}" for k, v in sorted(params_to_sign.items())
    )
    # SHA-256 signature
    signature_raw = f"{param_string}{CLOUDINARY_API_SECRET}"
    signature = hashlib.sha256(signature_raw.encode()).hexdigest()

    logger.info(f"Cloudinary upload signature generated for folder '{folder}'")

    return {
        "signature": signature,
        "timestamp": timestamp,
        "api_key": CLOUDINARY_API_KEY,
        "cloud_name": CLOUDINARY_CLOUD_NAME,
        "folder": folder,
    }
