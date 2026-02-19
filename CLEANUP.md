# 🧹 Project Cleanup Instructions

## Duplicate Folders Detected

Your project has duplicate folders that should be removed:

### ❌ Remove These Folders:
1. **`PDF/`** - Old backend folder (use `backend/` instead)
2. **`pdf-frontend/`** - Old frontend folder (use `frontend/` instead)

### ✅ Keep These Folders:
1. **`backend/`** - Production-ready backend
2. **`frontend/`** - Production-ready frontend

---

## Cleanup Commands

### Windows (PowerShell)

```powershell
# Navigate to project root
cd C:\Users\HP\Downloads\PDF-Extractor

# Remove old folders
Remove-Item -Recurse -Force .\PDF\
Remove-Item -Recurse -Force .\pdf-frontend\

# Remove from git tracking (if already committed)
git rm -r --cached PDF/
git rm -r --cached pdf-frontend/
git commit -m "Remove duplicate folders"
```

### Windows (CMD)

```cmd
cd C:\Users\HP\Downloads\PDF-Extractor
rmdir /s /q PDF
rmdir /s /q pdf-frontend
```

### macOS/Linux

```bash
cd ~/Downloads/PDF-Extractor
rm -rf PDF/
rm -rf pdf-frontend/
```

---

## After Cleanup

Your project structure should look like:

```
PDF-Extractor/
├── backend/
│   ├── utils/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── .env
├── .gitignore
└── README.md
```

---

## Verify Cleanup

Run this command to verify:

```bash
# Windows
dir

# macOS/Linux
ls -la
```

You should NOT see `PDF/` or `pdf-frontend/` folders.

---

## Git Cleanup (If folders were tracked)

If these folders were previously committed to git:

```bash
# Check git status
git status

# If files show as deleted, commit the changes
git add .
git commit -m "Clean up duplicate folders and restructure project"

# Push to remote
git push origin main
```

---

## ✅ Verification Checklist

- [ ] `PDF/` folder removed
- [ ] `pdf-frontend/` folder removed
- [ ] `backend/` folder exists and working
- [ ] `frontend/` folder exists and working
- [ ] Backend runs on http://localhost:5000
- [ ] Frontend runs on http://localhost:3000
- [ ] Git tracking cleaned up
- [ ] No duplicate files in repository

---

**Note:** Make sure to backup any custom changes from old folders before deletion!
