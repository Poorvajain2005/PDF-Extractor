# 🚀 Extractor.AI – Hybrid PDF Text Extraction Engine

Extractor.AI is a full-stack intelligent PDF extraction system that automatically detects document type and switches between native parsing and OCR for optimal accuracy and performance.

**Designed & Engineered by PJ**

---

## 🔥 Key Features

- ✅ **Hybrid Extraction Engine** – Smart detection between text and OCR modes
- ✅ **Native PDF Text Parsing** – Fast mode using PyPDF2
- ✅ **OCR for Scanned PDFs** – Tesseract + Poppler fallback
- ✅ **Automatic Engine Switching** – Seamless transition based on content
- ✅ **Performance Tracking** – Real-time latency monitoring
- ✅ **Modern UI** – Dark/Light theme with smooth animations
- ✅ **Copy to Clipboard** – Instant text copying
- ✅ **Production Ready** – Validation, error handling, logging, CORS
- ✅ **Secure** – 10MB file size limit, PDF-only validation

---

## 🧠 How It Works

### 1️⃣ Native Parsing (Fast Mode)
- Uses **PyPDF2** to extract embedded digital text
- Fastest method for machine-readable PDFs
- Returns results in milliseconds

### 2️⃣ OCR Fallback (Automatic)
If no text is detected:
- Converts PDF pages to images using **Poppler**
- Applies **Tesseract OCR** for text recognition
- Returns scanned text results

This ensures maximum compatibility with:
- Digital PDFs
- Scanned documents
- Mixed content PDFs

---

## 🏗 Architecture Overview

```
Frontend (React)
    ↓
Flask Backend API
    ↓
Smart Engine Decision Layer
    ↓
[PyPDF2] OR [Poppler → Tesseract OCR]
```

---

## 🖥 Tech Stack

### Backend
- **Python 3.x**
- **Flask** – Web framework
- **PyPDF2** – Native text extraction
- **pdf2image** – PDF to image conversion
- **pytesseract** – OCR engine wrapper
- **Poppler** – PDF rendering
- **Flask-CORS** – Cross-origin resource sharing
- **python-dotenv** – Environment variable management

### Frontend
- **React.js** – UI framework
- **Axios** – HTTP client
- **Context API** – Theme management
- **CSS Variables** – Dynamic theming

---

## 📂 Project Structure

```
PDF-Extractor/
├── backend/
│   ├── utils/
│   │   └── extract.py          # Extraction & OCR logic
│   ├── app.py                   # Flask entrypoint
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment template
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.js               # Main app component
│   │   ├── FileUpload.js        # Upload & extraction UI
│   │   ├── Navbar.js            # Navigation bar
│   │   ├── App.css              # Styling
│   │   └── index.js             # React entry
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Installation Guide

### Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** and npm installed
3. **Tesseract OCR** installed:
   - Windows: https://github.com/UB-Mannheim/tesseract/wiki
   - macOS: `brew install tesseract`
   - Linux: `sudo apt-get install tesseract-ocr`

4. **Poppler** installed:
   - Windows: Download from https://github.com/oschwartz10612/poppler-windows/releases/
   - macOS: `brew install poppler`
   - Linux: `sudo apt-get install poppler-utils`

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Poorvajain2005/PDF-Extractor.git
cd PDF-Extractor
```

---

### 2️⃣ Backend Setup

#### Step 1: Create Virtual Environment

```bash
cd backend
python -m venv venv
```

#### Step 2: Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

#### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 4: Configure Environment Variables

```bash
# Copy the example file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux
```

Edit `.env` and set your paths:

```env
FLASK_ENV=production
FLASK_APP=app.py
FRONTEND_URL=http://localhost:3000
TESSERACT_PATH=C:/Program Files/Tesseract-OCR/tesseract.exe
POPPLER_PATH=C:/poppler/poppler-23.08.0/Library/bin
```

**Note:** Adjust paths based on your installation locations.

#### Step 5: Run Backend

```bash
python app.py
```

Backend runs on: **http://127.0.0.1:5000**

---

### 3️⃣ Frontend Setup

#### Step 1: Navigate to Frontend

```bash
cd ../frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Configure Environment Variables

```bash
# Copy the example file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

#### Step 4: Run Frontend

```bash
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 🚀 Usage

1. Open **http://localhost:3000** in your browser
2. Click **"Upload PDF"** and select a PDF file (max 10MB)
3. Click **"Start Extraction"**
4. View extracted text in the results panel
5. Check extraction mode (TEXT/OCR) and processing time
6. Click **"Copy"** to copy text to clipboard

---

## 🧪 Example Use Cases

- Resume text extraction
- Invoice data extraction
- Scanned notes conversion
- Academic PDF processing
- Document digitization
- Legal document parsing

---

## 🎯 Engineering Decisions

- **Hybrid architecture** ensures reliability across document types
- **Separation of concerns** – Frontend/backend for scalability
- **Smart detection layer** improves user experience
- **Unique temp files** prevent race conditions
- **Automatic cleanup** prevents disk space issues
- **Environment-driven config** for deployment flexibility
- **CORS restrictions** for security
- **File validation** prevents abuse
- **Comprehensive logging** for debugging

---

## 🔒 Security Features

- File type validation (PDF only)
- File size limit (10MB)
- CORS restricted to frontend origin
- No credential exposure
- Automatic temp file cleanup
- Input sanitization

---

## 📊 Performance Awareness

The system tracks:
- **Extraction Mode** (Standard/OCR)
- **Processing Time** (Latency in seconds)
- **Status Messages** (Real-time feedback)

This allows performance evaluation and transparency.

---

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables in hosting platform
2. Ensure Tesseract and Poppler are available (use buildpacks)
3. Set `FRONTEND_URL` to your deployed frontend URL

### Frontend Deployment (Vercel/Netlify)

1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Run `npm run build`
3. Deploy the `build/` folder

---

## 🛠 Troubleshooting

### Backend Issues

**Error: Tesseract not found**
- Verify `TESSERACT_PATH` in `.env` points to correct executable
- Windows: Usually `C:/Program Files/Tesseract-OCR/tesseract.exe`

**Error: Poppler not found**
- Verify `POPPLER_PATH` in `.env` points to bin directory
- Ensure poppler binaries are in PATH

**CORS errors**
- Check `FRONTEND_URL` in backend `.env` matches frontend URL

### Frontend Issues

**Cannot connect to backend**
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`

**Theme not switching**
- Clear browser cache
- Check browser console for errors

---

## 🔮 Future Improvements

- [ ] Structured JSON extraction
- [ ] Keyword detection and highlighting
- [ ] PDF preview panel
- [ ] Download extracted text as file
- [ ] Batch processing support
- [ ] Confidence scoring for OCR
- [ ] Multi-language OCR support
- [ ] API rate limiting
- [ ] User authentication
- [ ] Cloud storage integration

---

## 👩‍💻 About the Developer

**Designed & engineered by PJ**  
Computer Science Student  
Focused on backend systems & AI-driven workflows

---

## ⭐ Why This Project Matters

This project demonstrates:

- ✅ Full-stack development capability
- ✅ Backend API design
- ✅ OCR integration
- ✅ System-level decision logic
- ✅ UI/UX awareness
- ✅ Performance measurement thinking
- ✅ Production-ready code practices
- ✅ Security consciousness

---

## 📝 License

This project is open source and available for educational purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ by PJ**
