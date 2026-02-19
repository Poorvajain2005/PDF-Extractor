import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from utils.extract import validate_pdf_file, extract_text_from_pdf_file


load_dotenv()

# Logging
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(asctime)s %(name)s: %(message)s')
logger = logging.getLogger('backend')


app = Flask(__name__)

# CORS - restrict to frontend URL provided by environment
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
CORS(app, origins=[FRONTEND_URL])


# Environment-driven binaries
TESSERACT_PATH = os.getenv('TESSERACT_PATH')
POPPLER_PATH = os.getenv('POPPLER_PATH')


@app.route('/')
def home():
    return jsonify({'message': 'Hybrid OCR Backend Running ✅'})


@app.route('/extract', methods=['POST'])
def extract():
    try:
        file = request.files.get('pdf')
        if not file:
            logger.warning('No file uploaded')
            return jsonify({'error': 'No file uploaded'}), 400

        # Validation
        is_valid, err = validate_pdf_file(file)
        if not is_valid:
            logger.warning('Validation failed: %s', err)
            return jsonify({'error': err}), 400

        # Extract
        try:
            text, mode = extract_text_from_pdf_file(file, poppler_path=POPPLER_PATH, tesseract_cmd=TESSERACT_PATH)
            return jsonify({'text': text, 'mode': mode}), 200
        except Exception as e:
            logger.exception('Extraction failed')
            return jsonify({'error': 'Failed to extract text from PDF.'}), 500

    except Exception as e:
        logger.exception('Unhandled server error')
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Host 0.0.0.0 for container friendliness
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=False)
