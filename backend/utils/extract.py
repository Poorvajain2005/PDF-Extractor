import os
import uuid
import tempfile
import logging
from typing import Tuple

import PyPDF2
import pytesseract
from pdf2image import convert_from_path


logger = logging.getLogger(__name__)


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def _is_pdf_filename(filename: str) -> bool:
    return filename.lower().endswith('.pdf')


def save_file_to_temp(uploaded_file) -> str:
    """Save uploaded FileStorage to a uniquely named temp file and return path."""
    unique_name = f"{uuid.uuid4()}.pdf"
    temp_path = os.path.join(tempfile.gettempdir(), unique_name)
    # Ensure pointer at start
    uploaded_file.seek(0)
    uploaded_file.save(temp_path)
    return temp_path


def validate_pdf_file(uploaded_file) -> Tuple[bool, str]:
    # Validate filename
    filename = getattr(uploaded_file, 'filename', '') or ''
    if not _is_pdf_filename(filename):
        return False, 'Uploaded file is not a PDF.'

    # Save to temp to measure size (some servers don't set content-length)
    temp_path = save_file_to_temp(uploaded_file)
    try:
        size = os.path.getsize(temp_path)
        if size > MAX_FILE_SIZE:
            return False, 'File exceeds maximum allowed size (10 MB).'
    finally:
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception:
            pass

    return True, ''


def extract_text_from_pdf_file(uploaded_file, poppler_path: str = None, tesseract_cmd: str = None) -> Tuple[str, str]:
    """Extract text from uploaded_file. Returns tuple(text, mode) where mode is 'text' or 'ocr'."""
    # Save uploaded file to unique temp file
    temp_path = save_file_to_temp(uploaded_file)

    # Configure tesseract executable
    if tesseract_cmd:
        pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    try:
        # 1) Try normal text extraction
        try:
            reader = PyPDF2.PdfReader(temp_path)
            text_output = ''
            for page in reader.pages:
                text_output += page.extract_text() or ''
            if text_output.strip():
                logger.info('Extracted using text mode')
                return text_output.strip(), 'text'
        except Exception as e:
            logger.debug('PyPDF2 text extraction failed: %s', e)

        # 2) Fallback to OCR
        logger.info('No text found, switching to OCR')
        images = convert_from_path(temp_path, dpi=200, poppler_path=poppler_path)
        ocr_text = ''
        for img in images:
            ocr_text += pytesseract.image_to_string(img, config='--oem 3 --psm 6')

        return ocr_text.strip(), 'ocr'

    finally:
        # Cleanup
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception as e:
            logger.warning('Failed to remove temp file %s: %s', temp_path, e)