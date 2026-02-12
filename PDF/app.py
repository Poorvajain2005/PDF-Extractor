from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import pytesseract
from pdf2image import convert_from_path
import os

app = Flask(__name__)
CORS(app)

# 🔹 Set Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# 🔹 Set Poppler BIN path
POPPLER_PATH = r"C:\poppler\Release-25.12.0-0\poppler-25.12.0\Library\bin"


@app.route("/")
def home():
    return "Hybrid OCR Backend Running ✅"


@app.route("/extract", methods=["POST"])
def extract_pdf():
    try:
        file = request.files.get("pdf")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        print("📄 Processing file...")

        # ----------------------------
        # 1️⃣ Try normal text extraction (FAST)
        # ----------------------------
        reader = PyPDF2.PdfReader(file)
        text_output = ""

        for page in reader.pages:
            text_output += page.extract_text() or ""

        # If normal text found → return immediately
        if text_output.strip():
            print("⚡ Extracted using normal text mode")
            return jsonify({
                "text": text_output.strip(),
                "mode": "text"
            })

        # ----------------------------
        # 2️⃣ Switch to OCR (Scanned PDF)
        # ----------------------------
        print("🔍 No text found. Switching to OCR...")

        temp_path = "temp.pdf"
        file.seek(0)
        file.save(temp_path)

        # Convert PDF to images (Optimized DPI for speed)
        images = convert_from_path(
            temp_path,
            dpi=120,  # lower DPI = faster
            poppler_path=POPPLER_PATH
        )

        ocr_text = ""

        for img in images:
            ocr_text += pytesseract.image_to_string(
                img,
                config="--oem 3 --psm 6"  # fast + optimized
            )

        os.remove(temp_path)

        print("✅ OCR completed")

        return jsonify({
            "text": ocr_text.strip(),
            "mode": "ocr"
        })

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=False)
