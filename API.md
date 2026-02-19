# 📡 API Documentation

Complete API reference for Extractor.AI backend.

---

## Base URL

**Local Development:**
```
http://localhost:5000
```

**Production:**
```
https://your-backend-url.com
```

---

## Authentication

Currently, no authentication is required. Future versions may include API keys.

---

## Endpoints

### 1. Health Check

Check if the backend is running.

#### Request

```http
GET /
```

#### Response

**Success (200 OK):**

```json
{
  "message": "Hybrid OCR Backend Running ✅"
}
```

#### Example

```bash
curl http://localhost:5000/
```

```javascript
// JavaScript
fetch('http://localhost:5000/')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 2. Extract Text from PDF

Extract text from a PDF file using hybrid extraction (text + OCR).

#### Request

```http
POST /extract
Content-Type: multipart/form-data
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pdf | File | Yes | PDF file to extract text from (max 10MB) |

#### Response

**Success (200 OK):**

```json
{
  "text": "Extracted text content...",
  "mode": "text"
}
```

or

```json
{
  "text": "OCR extracted text...",
  "mode": "ocr"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| text | string | Extracted text content |
| mode | string | Extraction mode: "text" (fast) or "ocr" (scanned) |

**Error Responses:**

**400 Bad Request - No file uploaded:**
```json
{
  "error": "No file uploaded"
}
```

**400 Bad Request - Invalid file type:**
```json
{
  "error": "Uploaded file is not a PDF."
}
```

**400 Bad Request - File too large:**
```json
{
  "error": "File exceeds maximum allowed size (10 MB)."
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to extract text from PDF."
}
```

or

```json
{
  "error": "Internal server error"
}
```

#### Example

**cURL:**

```bash
curl -X POST http://localhost:5000/extract \
  -F "pdf=@/path/to/document.pdf"
```

**JavaScript (Axios):**

```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('pdf', fileInput.files[0]);

axios.post('http://localhost:5000/extract', formData)
  .then(response => {
    console.log('Text:', response.data.text);
    console.log('Mode:', response.data.mode);
  })
  .catch(error => {
    console.error('Error:', error.response.data.error);
  });
```

**JavaScript (Fetch):**

```javascript
const formData = new FormData();
formData.append('pdf', fileInput.files[0]);

fetch('http://localhost:5000/extract', {
  method: 'POST',
  body: formData
})
  .then(res => res.json())
  .then(data => {
    console.log('Text:', data.text);
    console.log('Mode:', data.mode);
  })
  .catch(err => console.error('Error:', err));
```

**Python (requests):**

```python
import requests

url = 'http://localhost:5000/extract'
files = {'pdf': open('document.pdf', 'rb')}

response = requests.post(url, files=files)
data = response.json()

print('Text:', data['text'])
print('Mode:', data['mode'])
```

---

## Extraction Modes

### Text Mode (Fast)

- Uses PyPDF2 for native text extraction
- Works with digital PDFs containing embedded text
- Processing time: < 1 second for most files
- Best for: Documents created digitally (Word, Google Docs, etc.)

### OCR Mode (Fallback)

- Uses Tesseract OCR via pdf2image
- Automatically triggered when no text is found
- Converts PDF pages to images first
- Processing time: 2-10 seconds depending on file size
- Best for: Scanned documents, images, photos of documents

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production:

```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["100 per hour"]
)

@app.route('/extract', methods=['POST'])
@limiter.limit("10 per minute")
def extract():
    # ...
```

---

## CORS Configuration

The backend restricts CORS to the frontend URL specified in environment variables.

**Allowed Origin:**
```
FRONTEND_URL=http://localhost:3000
```

**Allowed Methods:**
- GET
- POST
- OPTIONS

**Allowed Headers:**
- Content-Type
- Authorization

---

## File Validation

### File Type

Only PDF files are accepted. Validation checks:
- File extension must be `.pdf`
- Case-insensitive check

### File Size

Maximum file size: **10 MB** (10,485,760 bytes)

Files exceeding this limit will be rejected with a 400 error.

---

## Error Handling

All errors return JSON responses with an `error` field:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful extraction |
| 400 | Bad Request | Invalid input (no file, wrong type, too large) |
| 500 | Internal Server Error | Server-side processing error |

---

## Logging

The backend logs all requests and errors:

```
[INFO] 2024-01-15 10:30:45 backend: Extracted using text mode
[INFO] 2024-01-15 10:31:20 backend: No text found, switching to OCR
[WARNING] 2024-01-15 10:32:10 backend: Validation failed: File exceeds maximum allowed size (10 MB).
[ERROR] 2024-01-15 10:33:05 backend: Extraction failed
```

---

## Performance Considerations

### Text Extraction
- Average time: 0.5-1 second
- Memory usage: Low (~50MB)
- CPU usage: Minimal

### OCR Extraction
- Average time: 3-8 seconds per page
- Memory usage: Medium (~200-500MB)
- CPU usage: High (100% during processing)

### Optimization Tips

1. **Reduce DPI** for faster OCR:
```python
images = convert_from_path(temp_path, dpi=150)  # Lower = faster
```

2. **Process pages in parallel** (advanced):
```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=4) as executor:
    results = executor.map(pytesseract.image_to_string, images)
```

3. **Add caching** for repeated requests

---

## Security Best Practices

### Current Implementation

✅ File type validation  
✅ File size limits  
✅ CORS restrictions  
✅ Unique temp files  
✅ Automatic cleanup  
✅ No credential exposure  

### Recommended Additions

- [ ] API key authentication
- [ ] Rate limiting per IP
- [ ] Request logging
- [ ] Input sanitization
- [ ] Virus scanning
- [ ] Content Security Policy headers

---

## Testing

### Unit Tests

```python
# test_app.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'Running' in response.data

def test_extract_no_file(client):
    response = client.post('/extract')
    assert response.status_code == 400
    assert b'No file uploaded' in response.data
```

### Integration Tests

```bash
# Test with sample PDF
curl -X POST http://localhost:5000/extract \
  -F "pdf=@test_files/sample.pdf" \
  | jq .
```

---

## Changelog

### v1.0.0 (Current)
- Initial release
- Hybrid text + OCR extraction
- File validation
- CORS support
- Environment-based configuration

### Future Versions
- v1.1.0: API authentication
- v1.2.0: Batch processing
- v1.3.0: Webhook support
- v2.0.0: Multi-language OCR

---

## Support

For issues or questions:
- Open an issue on GitHub
- Check [README.md](README.md) for documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for hosting

---

**API Version:** 1.0.0  
**Last Updated:** 2024
