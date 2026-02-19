# ⚡ Quick Start Guide

Get Extractor.AI running in 5 minutes!

---

## 🎯 Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- Tesseract OCR installed
- Poppler installed

---

## 🚀 Quick Setup

### 1️⃣ Clone & Navigate

```bash
git clone https://github.com/Poorvajain2005/PDF-Extractor.git
cd PDF-Extractor
```

---

### 2️⃣ Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# Edit .env and set your paths:
# TESSERACT_PATH=C:/Program Files/Tesseract-OCR/tesseract.exe
# POPPLER_PATH=C:/poppler/poppler-23.08.0/Library/bin

# Run backend
python app.py
```

✅ Backend running at **http://localhost:5000**

---

### 3️⃣ Frontend Setup (2 minutes)

Open a NEW terminal:

```bash
# Navigate to frontend
cd PDF-Extractor/frontend

# Install dependencies
npm install

# Setup environment
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# Run frontend
npm start
```

✅ Frontend running at **http://localhost:3000**

---

## 🎉 You're Ready!

1. Open **http://localhost:3000**
2. Upload a PDF file
3. Click "Start Extraction"
4. View results!

---

## 🐛 Quick Troubleshooting

### Backend won't start?

```bash
# Check Python version
python --version  # Should be 3.8+

# Check if port 5000 is free
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux
```

### Frontend won't start?

```bash
# Check Node version
node --version  # Should be 16+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tesseract not found?

**Windows:**
```powershell
# Install via Chocolatey
choco install tesseract

# Or download from:
# https://github.com/UB-Mannheim/tesseract/wiki
```

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

### Poppler not found?

**Windows:**
- Download from: https://github.com/oschwartz10612/poppler-windows/releases/
- Extract and set path in .env

**macOS:**
```bash
brew install poppler
```

**Linux:**
```bash
sudo apt-get install poppler-utils
```

---

## 📚 Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review [CLEANUP.md](CLEANUP.md) to remove duplicate folders

---

## 💡 Tips

- Use **dark theme** for better experience
- Max file size is **10MB**
- Supports **PDF files only**
- OCR works best with **clear scans**
- Processing time varies by file size

---

**Happy Extracting! 🚀**
