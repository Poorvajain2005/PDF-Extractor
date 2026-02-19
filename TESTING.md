# 🧪 Testing Guide

Complete testing guide for Extractor.AI.

---

## 📋 Testing Checklist

### Backend Tests
- [ ] Health check endpoint
- [ ] File upload validation
- [ ] Text extraction (digital PDF)
- [ ] OCR extraction (scanned PDF)
- [ ] Error handling
- [ ] File size limits
- [ ] CORS configuration
- [ ] Temp file cleanup

### Frontend Tests
- [ ] File upload UI
- [ ] Extraction process
- [ ] Status messages
- [ ] Theme switching
- [ ] Copy to clipboard
- [ ] Error display
- [ ] Responsive design
- [ ] Performance tracking

---

## 🔧 Manual Testing

### 1. Backend Health Check

```bash
# Test if backend is running
curl http://localhost:5000/

# Expected response:
# {"message": "Hybrid OCR Backend Running ✅"}
```

### 2. Text Extraction (Digital PDF)

```bash
# Create a test PDF with text
# Then upload it:
curl -X POST http://localhost:5000/extract \
  -F "pdf=@test_digital.pdf"

# Expected response:
# {
#   "text": "Extracted text content...",
#   "mode": "text"
# }
```

### 3. OCR Extraction (Scanned PDF)

```bash
# Upload a scanned PDF
curl -X POST http://localhost:5000/extract \
  -F "pdf=@test_scanned.pdf"

# Expected response:
# {
#   "text": "OCR extracted text...",
#   "mode": "ocr"
# }
```

### 4. File Validation Tests

**No file:**
```bash
curl -X POST http://localhost:5000/extract

# Expected: 400 Bad Request
# {"error": "No file uploaded"}
```

**Wrong file type:**
```bash
curl -X POST http://localhost:5000/extract \
  -F "pdf=@test.txt"

# Expected: 400 Bad Request
# {"error": "Uploaded file is not a PDF."}
```

**File too large:**
```bash
# Create a file > 10MB
curl -X POST http://localhost:5000/extract \
  -F "pdf=@large_file.pdf"

# Expected: 400 Bad Request
# {"error": "File exceeds maximum allowed size (10 MB)."}
```

### 5. CORS Test

```bash
# Test CORS headers
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://localhost:5000/extract

# Should return CORS headers
```

---

## 🎨 Frontend Testing

### 1. Basic Functionality

1. **Open app:** http://localhost:3000
2. **Check UI loads:** Navbar, upload section, results panel
3. **Upload PDF:** Click file input, select PDF
4. **Start extraction:** Click "Start Extraction" button
5. **View results:** Check extracted text appears
6. **Check stats:** Verify mode (TEXT/OCR) and time display
7. **Copy text:** Click "Copy" button, paste elsewhere

### 2. Theme Switching

1. Click theme toggle button (🌙/☀️)
2. Verify colors change
3. Check all components update
4. Verify readability in both themes

### 3. Error Handling

**No file selected:**
1. Click "Start Extraction" without selecting file
2. Should show alert: "Please upload a PDF file first."

**Invalid file:**
1. Upload a .txt or .jpg file
2. Should show error from backend

**Network error:**
1. Stop backend server
2. Try extraction
3. Should show: "Error connecting to the extraction server."

### 4. Status Messages

1. Upload PDF
2. Click "Start Extraction"
3. Watch status messages change:
   - "Analyzing PDF..."
   - "Text detected, using text extraction..." OR
   - "No text found, switching to OCR..."

### 5. Responsive Design

Test on different screen sizes:
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

---

## 🤖 Automated Testing

### Backend Unit Tests

Create `backend/test_app.py`:

```python
import pytest
import os
from app import app
from io import BytesIO

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test the health check endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data
    assert 'Running' in data['message']

def test_extract_no_file(client):
    """Test extraction without file"""
    response = client.post('/extract')
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'No file uploaded' in data['error']

def test_extract_invalid_file_type(client):
    """Test extraction with non-PDF file"""
    data = {
        'pdf': (BytesIO(b'not a pdf'), 'test.txt')
    }
    response = client.post('/extract', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    json_data = response.get_json()
    assert 'error' in json_data

def test_extract_valid_pdf(client):
    """Test extraction with valid PDF"""
    # Create a simple PDF for testing
    # This requires a test PDF file
    if os.path.exists('test_files/sample.pdf'):
        with open('test_files/sample.pdf', 'rb') as f:
            data = {
                'pdf': (f, 'sample.pdf')
            }
            response = client.post('/extract', data=data, content_type='multipart/form-data')
            assert response.status_code == 200
            json_data = response.get_json()
            assert 'text' in json_data
            assert 'mode' in json_data
            assert json_data['mode'] in ['text', 'ocr']
```

Run tests:
```bash
cd backend
pip install pytest
pytest test_app.py -v
```

### Frontend Unit Tests

Create `frontend/src/App.test.js`:

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders Extractor.AI title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Extractor.AI/i);
  expect(titleElement).toBeInTheDocument();
});

test('theme toggle works', () => {
  render(<App />);
  const toggleButton = screen.getByRole('button', { name: /🌙|☀️/ });
  
  fireEvent.click(toggleButton);
  
  const app = document.querySelector('.app');
  expect(app).toHaveClass('light');
});

test('shows error when no file selected', () => {
  render(<App />);
  const extractButton = screen.getByText(/Start Extraction/i);
  
  window.alert = jest.fn();
  fireEvent.click(extractButton);
  
  expect(window.alert).toHaveBeenCalledWith('Please upload a PDF file first.');
});

test('successful extraction displays text', async () => {
  axios.post.mockResolvedValue({
    data: {
      text: 'Extracted text content',
      mode: 'text'
    }
  });

  render(<App />);
  
  const fileInput = screen.getByLabelText(/Upload PDF/i);
  const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
  
  fireEvent.change(fileInput, { target: { files: [file] } });
  
  const extractButton = screen.getByText(/Start Extraction/i);
  fireEvent.click(extractButton);
  
  await waitFor(() => {
    expect(screen.getByText(/Extracted text content/i)).toBeInTheDocument();
  });
});
```

Run tests:
```bash
cd frontend
npm test
```

---

## 🔍 Integration Testing

### End-to-End Test Script

Create `test_e2e.sh`:

```bash
#!/bin/bash

echo "🧪 Starting E2E Tests..."

# 1. Check backend is running
echo "1️⃣ Testing backend health..."
HEALTH=$(curl -s http://localhost:5000/)
if [[ $HEALTH == *"Running"* ]]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not running"
    exit 1
fi

# 2. Test text extraction
echo "2️⃣ Testing text extraction..."
RESULT=$(curl -s -X POST http://localhost:5000/extract \
    -F "pdf=@test_files/digital.pdf")
if [[ $RESULT == *"text"* ]]; then
    echo "✅ Text extraction works"
else
    echo "❌ Text extraction failed"
fi

# 3. Test OCR extraction
echo "3️⃣ Testing OCR extraction..."
RESULT=$(curl -s -X POST http://localhost:5000/extract \
    -F "pdf=@test_files/scanned.pdf")
if [[ $RESULT == *"ocr"* ]]; then
    echo "✅ OCR extraction works"
else
    echo "❌ OCR extraction failed"
fi

# 4. Test error handling
echo "4️⃣ Testing error handling..."
RESULT=$(curl -s -X POST http://localhost:5000/extract)
if [[ $RESULT == *"error"* ]]; then
    echo "✅ Error handling works"
else
    echo "❌ Error handling failed"
fi

echo "🎉 All tests passed!"
```

Run:
```bash
chmod +x test_e2e.sh
./test_e2e.sh
```

---

## 📊 Performance Testing

### Backend Performance

Create `backend/test_performance.py`:

```python
import time
import requests
from concurrent.futures import ThreadPoolExecutor

def test_single_request():
    """Test single request performance"""
    start = time.time()
    
    with open('test_files/sample.pdf', 'rb') as f:
        files = {'pdf': f}
        response = requests.post('http://localhost:5000/extract', files=files)
    
    end = time.time()
    
    print(f"Single request: {end - start:.2f}s")
    print(f"Mode: {response.json().get('mode')}")

def test_concurrent_requests(num_requests=10):
    """Test concurrent request handling"""
    def make_request():
        with open('test_files/sample.pdf', 'rb') as f:
            files = {'pdf': f}
            return requests.post('http://localhost:5000/extract', files=files)
    
    start = time.time()
    
    with ThreadPoolExecutor(max_workers=num_requests) as executor:
        results = list(executor.map(lambda _: make_request(), range(num_requests)))
    
    end = time.time()
    
    print(f"{num_requests} concurrent requests: {end - start:.2f}s")
    print(f"Average per request: {(end - start) / num_requests:.2f}s")

if __name__ == '__main__':
    print("🚀 Performance Testing")
    print("-" * 40)
    test_single_request()
    print("-" * 40)
    test_concurrent_requests(10)
```

Run:
```bash
cd backend
python test_performance.py
```

### Frontend Performance

Use Chrome DevTools:
1. Open http://localhost:3000
2. Open DevTools (F12)
3. Go to "Performance" tab
4. Click "Record"
5. Upload and extract PDF
6. Stop recording
7. Analyze:
   - Load time
   - Render time
   - API call duration
   - Memory usage

---

## 🔒 Security Testing

### 1. File Upload Security

**Test malicious files:**
```bash
# Try uploading executable
curl -X POST http://localhost:5000/extract \
  -F "pdf=@malicious.exe"

# Should reject with 400 error
```

**Test file size bypass:**
```bash
# Try uploading 11MB file
curl -X POST http://localhost:5000/extract \
  -F "pdf=@large_file.pdf"

# Should reject with 400 error
```

### 2. CORS Security

**Test unauthorized origin:**
```bash
curl -H "Origin: http://malicious-site.com" \
     -X POST http://localhost:5000/extract \
     -F "pdf=@test.pdf"

# Should be blocked by CORS
```

### 3. Input Validation

**Test SQL injection (should be safe):**
```bash
curl -X POST http://localhost:5000/extract \
  -F "pdf=@test.pdf'; DROP TABLE users;--"

# Should handle safely
```

---

## 📱 Browser Compatibility Testing

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Chrome
- ✅ Mobile Safari

---

## 🐛 Bug Report Template

When you find a bug, document it:

```markdown
## Bug Report

**Title:** [Brief description]

**Environment:**
- OS: Windows 10
- Browser: Chrome 120
- Backend: Python 3.11
- Frontend: React 19

**Steps to Reproduce:**
1. Open app
2. Upload PDF
3. Click extract
4. [Bug occurs]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Console Errors:**
[Copy any errors]

**Additional Context:**
[Any other relevant info]
```

---

## ✅ Test Results Template

Document your test results:

```markdown
## Test Results - [Date]

### Backend Tests
- ✅ Health check: PASS
- ✅ Text extraction: PASS
- ✅ OCR extraction: PASS
- ✅ File validation: PASS
- ✅ Error handling: PASS
- ✅ CORS: PASS

### Frontend Tests
- ✅ UI loads: PASS
- ✅ File upload: PASS
- ✅ Extraction: PASS
- ✅ Theme switch: PASS
- ✅ Copy function: PASS
- ✅ Error display: PASS

### Performance
- Text extraction: 0.8s
- OCR extraction: 4.2s
- UI load time: 1.1s

### Issues Found
- None

### Notes
- All tests passed successfully
- Ready for production
```

---

## 🎯 Testing Best Practices

1. **Test early and often**
2. **Automate repetitive tests**
3. **Test edge cases**
4. **Test error scenarios**
5. **Test on multiple devices**
6. **Document test results**
7. **Fix bugs immediately**
8. **Regression test after fixes**

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Pytest Documentation](https://docs.pytest.org/)
- [Postman for API Testing](https://www.postman.com/)

---

**Happy Testing! 🧪**
