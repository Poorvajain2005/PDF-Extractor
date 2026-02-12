import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ mode: "", time: "" });
  const [isDark, setIsDark] = useState(true);

  const theme = isDark ? themes.dark : themes.light;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const extractPDF = async () => {
    if (!file) return alert("Please upload a PDF file first.");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setLoading(true);
      const startTime = performance.now();
      
      const res = await axios.post("http://127.0.0.1:5000/extract", formData);
      
      const endTime = performance.now();
      setOutput(res.data.text || "No text could be extracted from this document.");
      setStats({
        mode: res.data.mode || "Standard",
        time: ((endTime - startTime) / 1000).toFixed(2) + "s"
      });
    } catch (err) {
      console.error("Extraction Error:", err);
      alert("Error connecting to the extraction server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.wrapper, backgroundColor: theme.bg, color: theme.text }}>
      {/* Header / Toggle */}
      <div style={styles.header}>
        <div style={styles.badge}>v1.0 Stable</div>
        <button onClick={() => setIsDark(!isDark)} style={{ ...styles.toggleBtn, color: theme.textSecondary }}>
          {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <main style={{ ...styles.container, backgroundColor: theme.card, borderColor: theme.border }}>
        {/* Left Side: Controls */}
        <div style={{ ...styles.sidebar, borderRight: `1px solid ${theme.border}` }}>
          <h2 style={styles.brand}>Extractor<span style={{ color: theme.accent }}>.AI</span></h2>
          <p style={{ ...styles.desc, color: theme.textSecondary }}>
            High-precision PDF data extraction using hybrid OCR technology.
          </p>

          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: theme.text }}>Upload Document</label>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              style={{ ...styles.fileInput, backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }} 
            />
          </div>

          <button 
            onClick={extractPDF} 
            disabled={loading || !file}
            style={{ 
              ...styles.mainBtn, 
              backgroundColor: loading || !file ? theme.border : theme.accent,
              cursor: loading || !file ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Processing..." : "Start Extraction"}
          </button>

          {stats.mode && !loading && (
            <div style={{ ...styles.statsCard, backgroundColor: theme.inputBg }}>
              <div style={styles.statLine}><span>Engine:</span> <strong>{stats.mode.toUpperCase()}</strong></div>
              <div style={styles.statLine}><span>Latency:</span> <strong>{stats.time}</strong></div>
              <div style={styles.statLine}><span>Status:</span> <span style={{ color: theme.accent }}>Verified ✓</span></div>
            </div>
          )}
        </div>

        {/* Right Side: Results */}
        <div style={styles.content}>
          <div style={styles.contentHeader}>
            <h3 style={styles.sectionTitle}>Extraction Output</h3>
            {output && <button onClick={() => navigator.clipboard.writeText(output)} style={styles.copyBtn}>Copy Text</button>}
          </div>
          
          <div style={{ ...styles.resultsArea, backgroundColor: theme.inputBg, borderColor: theme.border }}>
            {loading ? (
              <div style={styles.loaderContainer}>
                <div style={{ ...styles.spinner, borderTopColor: theme.accent }}></div>
                <p style={{ color: theme.textSecondary }}>Running Smart Analysis...</p>
              </div>
            ) : (
              <pre style={{ ...styles.pre, color: theme.text }}>
                {output || "Awaiting file upload... Results will appear here."}
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Professional Themes ---
const themes = {
  dark: {
    bg: "#0b0e14",
    card: "#151921",
    border: "#262d3d",
    text: "#eceef2",
    textSecondary: "#8b949e",
    accent: "#2ea043", // Github Green
    inputBg: "#0d1117",
  },
  light: {
    bg: "#f6f8fa",
    card: "#ffffff",
    border: "#d0d7de",
    text: "#1f2328",
    textSecondary: "#656d76",
    accent: "#1a7f37",
    inputBg: "#f6f8fa",
  }
};

const styles = {
  wrapper: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", padding: "20px", transition: "0.2s" },
  header: { width: "100%", maxWidth: "1100px", display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  badge: { padding: "4px 12px", borderRadius: "20px", backgroundColor: "#262d3d", color: "#8b949e", fontSize: "12px", border: "1px solid #30363d" },
  toggleBtn: { background: "none", border: "none", cursor: "pointer", fontWeight: "500", fontSize: "14px" },
  container: { width: "100%", maxWidth: "1100px", display: "flex", borderRadius: "12px", border: "1px solid", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" },
  sidebar: { width: "35%", padding: "40px", display: "flex", flexDirection: "column" },
  brand: { fontSize: "24px", margin: "0 0 10px 0", fontWeight: "800" },
  desc: { fontSize: "14px", lineHeight: "1.5", marginBottom: "30px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" },
  fileInput: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid", marginBottom: "20px", fontSize: "13px" },
  mainBtn: { padding: "14px", border: "none", borderRadius: "6px", color: "white", fontWeight: "600", fontSize: "15px", transition: "0.2s" },
  statsCard: { marginTop: "auto", padding: "15px", borderRadius: "8px", fontSize: "13px" },
  statLine: { display: "flex", justifyContent: "space-between", marginBottom: "5px" },
  content: { width: "65%", padding: "40px", display: "flex", flexDirection: "column" },
  contentHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  sectionTitle: { fontSize: "16px", fontWeight: "600", margin: 0 },
  copyBtn: { background: "none", border: "1px solid #2ea043", color: "#2ea043", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" },
  resultsArea: { flex: 1, borderRadius: "8px", border: "1px solid", padding: "20px", overflowY: "auto", minHeight: "400px" },
  pre: { margin: 0, whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.6" },
  loaderContainer: { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: "30px", height: "30px", border: "3px solid rgba(255,255,255,0.1)", borderRadius: "50%", animation: "spin 1s linear infinite" }
};

// Add this to your Global CSS or a style tag
// @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

export default FileUpload;