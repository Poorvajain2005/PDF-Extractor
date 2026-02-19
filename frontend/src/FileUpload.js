import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from './App';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [stats, setStats] = useState({ mode: '', time: '' });
  const { theme } = useContext(ThemeContext);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const extractPDF = async () => {
    if (!file) return alert('Please upload a PDF file first.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setLoading(true);
      setProcessingStage('Analyzing PDF...');
      const start = performance.now();
      
      setTimeout(() => {
        if (loading) setProcessingStage('Text detected, using text extraction...');
      }, 500);
      
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/extract`, formData);
      const end = performance.now();
      
      if (res.data.mode === 'ocr') {
        setProcessingStage('No text found, switching to OCR...');
      }
      
      setOutput(res.data.text || 'No text could be extracted from this document.');
      setStats({ mode: res.data.mode || 'unknown', time: ((end - start) / 1000).toFixed(2) + 's' });
    } catch (err) {
      console.error('Extraction Error:', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('Error connecting to the extraction server.');
      }
    } finally {
      setLoading(false);
      setProcessingStage('');
    }
  };

  const statusMessage = () => {
    if (loading && processingStage) return processingStage;
    if (!file) return 'Awaiting file upload...';
    return 'Ready to extract';
  }

  return (
    <main className={`container ${theme}`}>
      <aside className="sidebar">
        <h2 className="brand">Extractor<span className="accent">.AI</span></h2>
        <p className="desc">Hybrid OCR using fast text extraction + Tesseract fallback.</p>

        <label className="label">Upload PDF</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />

        <button className="primary" onClick={extractPDF} disabled={loading || !file}>{loading ? 'Processing...' : 'Start Extraction'}</button>

        {stats.mode && !loading && (
          <div className="stats">
            <div><strong>Engine:</strong> {stats.mode.toUpperCase()}</div>
            <div><strong>Time:</strong> {stats.time}</div>
          </div>
        )}
      </aside>

      <section className="results">
        <div className="results-header">
          <h3>Extraction Output</h3>
          {output && <button onClick={() => navigator.clipboard.writeText(output)} className="copy">Copy</button>}
        </div>

        <div className="results-body">
          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>{statusMessage()}</p>
            </div>
          ) : (
            <pre className="output">{output || 'Results will appear here.'}</pre>
          )}
        </div>
      </section>
    </main>
  );
};

export default FileUpload;
