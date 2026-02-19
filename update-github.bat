@echo off
echo Cleaning up git lock...
timeout /t 2 /nobreak >nul
del /f .git\index.lock 2>nul

echo Adding files to git...
git add .gitignore
git add README.md
git add API.md
git add CLEANUP.md
git add DEPLOYMENT.md
git add IMPROVEMENTS.md
git add QUICKSTART.md
git add START_HERE.md
git add TESTING.md
git add backend/
git add frontend/

echo Committing changes...
git commit -m "Production-ready: Add comprehensive documentation and polish" -m "" -m "What I Changed:" -m "- Added 8 documentation files (START_HERE, QUICKSTART, DEPLOYMENT, API, TESTING, CLEANUP, IMPROVEMENTS)" -m "- Enhanced frontend with better status messages and complete light theme" -m "- Fixed requirements.txt (removed PyMuPDF build issue)" -m "- Updated .gitignore with uploads/, logs, IDE files" -m "- Added frontend/.env.example template" -m "- Updated logo to PJ initials" -m "- Improved CSS with animations and transitions"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
