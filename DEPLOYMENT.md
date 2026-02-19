# 🚀 Deployment Guide

Complete guide for deploying Extractor.AI to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Dependencies up to date
- [ ] Security review completed
- [ ] CORS configured correctly
- [ ] Error handling tested
- [ ] File size limits verified

---

## 🔧 Backend Deployment

### Option 1: Render.com (Recommended)

#### Step 1: Prepare Backend

1. Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: extractor-ai-backend
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && python app.py"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: FRONTEND_URL
        value: https://your-frontend-url.vercel.app
      - key: TESSERACT_PATH
        value: /usr/bin/tesseract
      - key: POPPLER_PATH
        value: /usr/bin
```

2. Add Tesseract buildpack in Render dashboard:
   - Go to Environment
   - Add Native Environment: `tesseract-ocr poppler-utils`

#### Step 2: Deploy

1. Push code to GitHub
2. Connect Render to your repository
3. Set environment variables in Render dashboard
4. Deploy

---

### Option 2: Railway.app

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Deploy

```bash
cd backend
railway login
railway init
railway up
```

#### Step 3: Configure

1. Add environment variables in Railway dashboard
2. Install system dependencies:
   - Add `nixpacks.toml`:

```toml
[phases.setup]
aptPkgs = ["tesseract-ocr", "poppler-utils"]
```

---

### Option 3: Heroku

#### Step 1: Create Procfile

Create `backend/Procfile`:

```
web: python app.py
```

#### Step 2: Add Buildpacks

```bash
heroku buildpacks:add --index 1 heroku/python
heroku buildpacks:add --index 2 https://github.com/heroku/heroku-buildpack-apt
```

#### Step 3: Create Aptfile

Create `backend/Aptfile`:

```
tesseract-ocr
poppler-utils
```

#### Step 4: Deploy

```bash
cd backend
heroku create extractor-ai-backend
git push heroku main
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Deploy

```bash
cd frontend
vercel
```

#### Step 3: Configure

1. Set environment variable in Vercel dashboard:
   - `REACT_APP_API_URL` = Your backend URL

2. Or create `vercel.json`:

```json
{
  "env": {
    "REACT_APP_API_URL": "https://your-backend.onrender.com"
  }
}
```

---

### Option 2: Netlify

#### Step 1: Build

```bash
cd frontend
npm run build
```

#### Step 2: Deploy

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

#### Step 3: Configure

Add environment variable in Netlify dashboard:
- `REACT_APP_API_URL` = Your backend URL

---

### Option 3: GitHub Pages

#### Step 1: Install gh-pages

```bash
cd frontend
npm install --save-dev gh-pages
```

#### Step 2: Update package.json

```json
{
  "homepage": "https://yourusername.github.io/PDF-Extractor",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### Step 3: Deploy

```bash
npm run deploy
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
FLASK_ENV=production
FLASK_APP=app.py
PORT=5000
FRONTEND_URL=https://your-frontend-url.vercel.app
TESSERACT_PATH=/usr/bin/tesseract
POPPLER_PATH=/usr/bin
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

---

## 🐳 Docker Deployment (Advanced)

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV TESSERACT_PATH=/usr/bin/tesseract
ENV POPPLER_PATH=/usr/bin

EXPOSE 5000

CMD ["python", "app.py"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FRONTEND_URL=http://localhost:3000
      - TESSERACT_PATH=/usr/bin/tesseract
      - POPPLER_PATH=/usr/bin

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
```

Run with:

```bash
docker-compose up -d
```

---

## 🔍 Post-Deployment Testing

### Backend Health Check

```bash
curl https://your-backend-url.com/
# Should return: {"message": "Hybrid OCR Backend Running ✅"}
```

### Frontend Test

1. Open frontend URL
2. Upload a test PDF
3. Verify extraction works
4. Check console for errors
5. Test theme switching
6. Test copy functionality

### CORS Test

```bash
curl -H "Origin: https://your-frontend-url.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://your-backend-url.com/extract
```

---

## 📊 Monitoring

### Backend Logs

**Render:**
```bash
# View in dashboard or CLI
render logs
```

**Railway:**
```bash
railway logs
```

**Heroku:**
```bash
heroku logs --tail
```

### Frontend Analytics

Add to `frontend/public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🚨 Troubleshooting

### Issue: Tesseract not found

**Solution:** Ensure buildpack/apt packages installed:
- Render: Add native environment
- Heroku: Check Aptfile
- Docker: Verify apt-get install

### Issue: CORS errors

**Solution:** Update backend FRONTEND_URL to match deployed frontend

### Issue: Large file uploads failing

**Solution:** Increase server timeout:

```python
# backend/app.py
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB
```

### Issue: Slow OCR processing

**Solution:** 
- Reduce DPI in extract.py
- Add processing timeout
- Consider background job queue (Celery)

---

## 🎯 Performance Optimization

### Backend

1. **Enable Gunicorn** (production WSGI server):

```bash
pip install gunicorn
```

Update start command:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. **Add caching** for repeated requests

3. **Implement rate limiting**:

```bash
pip install flask-limiter
```

### Frontend

1. **Enable compression** in build

2. **Add service worker** for caching

3. **Lazy load components**

4. **Optimize images** in public folder

---

## 📈 Scaling

### Horizontal Scaling

- Use load balancer (Nginx/AWS ALB)
- Deploy multiple backend instances
- Use Redis for session management

### Vertical Scaling

- Increase server resources
- Optimize OCR parameters
- Add background job processing

---

## ✅ Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] SSL/HTTPS enabled
- [ ] Error logging configured
- [ ] File upload limits tested
- [ ] OCR functionality verified
- [ ] Theme switching works
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Monitoring setup
- [ ] Backup strategy defined

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Heroku Documentation](https://devcenter.heroku.com)
- [Docker Documentation](https://docs.docker.com)

---

**Deployment completed! 🎉**
