import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const ImportExport = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  // ===========================
  // EXPORT FUNCTIONS
  // ===========================
  const handleExport = async (format) => {
    try {
      setLoading(true);
      setProgress(0);
      setMessage('');
      setError('');

      const sampleData = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
      ];

      setProgress(30);

      const response = await axios.post(
        `${API_URL}/export/${format}`,
        format === 'csv'
          ? { data: sampleData, fields: ['id', 'name', 'email'] }
          : { data: sampleData },
        { responseType: 'blob' }
      );

      setProgress(80);

      // Shkarko file-in automatikisht
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
      setMessage(`✅ ${format.toUpperCase()} u eksportua me sukses!`);
    } catch (err) {
      setError(`❌ Export dështoi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // IMPORT FUNCTIONS
  // ===========================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleImport = async (format) => {
    try {
      if (!file) {
        setError('⚠️ Zgjidh një file fillimisht!');
        return;
      }

      setLoading(true);
      setProgress(0);
      setMessage('');
      setError('');

      const formData = new FormData();
      formData.append('file', file);

      setProgress(40);

      const response = await axios.post(
        `${API_URL}/import/${format}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        }
      );

      setProgress(100);
      setMessage(`✅ ${format.toUpperCase()} u importua me sukses! ${response.data.data.length} rreshta u lexuan.`);
    } catch (err) {
      setError(`❌ Import dështoi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // UI
  // ===========================
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📁 Import / Export</h2>

      {/* EXPORT SECTION */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📤 Export</h3>
        <div style={styles.buttonGroup}>
          <button
            style={styles.btnCSV}
            onClick={() => handleExport('csv')}
            disabled={loading}
          >
            Export CSV
          </button>
          <button
            style={styles.btnExcel}
            onClick={() => handleExport('excel')}
            disabled={loading}
          >
            Export Excel
          </button>
          <button
            style={styles.btnJSON}
            onClick={() => handleExport('json')}
            disabled={loading}
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* IMPORT SECTION */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📥 Import</h3>
        <input
          type="file"
          accept=".csv,.xlsx,.json"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        {file && <p style={styles.fileName}>📄 {file.name}</p>}
        <div style={styles.buttonGroup}>
          <button
            style={styles.btnCSV}
            onClick={() => handleImport('csv')}
            disabled={loading}
          >
            Import CSV
          </button>
          <button
            style={styles.btnExcel}
            onClick={() => handleImport('excel')}
            disabled={loading}
          >
            Import Excel
          </button>
          <button
            style={styles.btnJSON}
            onClick={() => handleImport('json')}
            disabled={loading}
          >
            Import JSON
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      {loading && (
        <div style={styles.progressContainer}>
          <p style={styles.progressText}>⏳ Duke u procesuar... {progress}%</p>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* MESSAGES */}
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

// ===========================
// STYLES
// ===========================
const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  section: {
    marginBottom: '30px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    color: '#555',
    marginBottom: '15px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  btnCSV: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnExcel: {
    padding: '10px 20px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnJSON: {
    padding: '10px 20px',
    backgroundColor: '#FF9800',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  fileInput: {
    marginBottom: '10px',
    display: 'block',
  },
  fileName: {
    color: '#666',
    fontSize: '13px',
    marginBottom: '10px',
  },
  progressContainer: {
    marginTop: '20px',
  },
  progressText: {
    color: '#555',
    marginBottom: '8px',
  },
  progressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease',
  },
  success: {
    color: '#4CAF50',
    marginTop: '15px',
    fontWeight: 'bold',
  },
  error: {
    color: '#f44336',
    marginTop: '15px',
    fontWeight: 'bold',
  },
};

export default ImportExport;
