import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";

const API_URL = "http://localhost:5000";

function Forms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.get('/forms')
      .then(res => {
        const data = res.data.data || res.data.forms || res.data || [];
        setForms(Array.isArray(data) ? data : []);
      })
      .catch(() => setMessage('Failed to load forms'))
      .finally(() => setLoading(false));
  }, []);

  const deleteForm = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/forms/${id}`);
      setForms(prev => prev.filter(f => f.id !== id));
      setMessage('Form deleted successfully');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleExport = async (format) => {
    try {
      setExporting(true);
      setMessage("");
      setProgress(0);
      const response = await axios.post(
        `${API_URL}/api/export/${format}`,
        format === "csv"
          ? { data: forms, fields: ["id", "title", "description", "createdAt"] }
          : { data: forms },
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          onDownloadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / (e.total || 1));
            setProgress(percent);
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `forms-export.${format === "excel" ? "xlsx" : format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setProgress(100);
      setMessage(`✅ Forms exported as ${format.toUpperCase()}!`);
    } catch (err) {
      setMessage(`❌ Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div>
      <div className="page-top">
        <div>
          <h1>Forms</h1>
          <p>Create and manage your forms.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={() => handleExport("csv")} disabled={exporting} style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Export CSV
          </button>
          <button onClick={() => handleExport("excel")} disabled={exporting} style={{ padding: "8px 16px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Export Excel
          </button>
          <button onClick={() => handleExport("json")} disabled={exporting} style={{ padding: "8px 16px", backgroundColor: "#FF9800", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Export JSON
          </button>
          <Link className="primary-btn" to="/create-form">New Form</Link>
        </div>
      </div>

      <ExportProgress loading={exporting} message={message} progress={progress} />

      <div className="forms-grid">
        {forms.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No forms yet. Create your first form!</p>
        ) : (
          forms.map((form) => (
            <div className="form-card" key={form.id}>
              <h2>{form.title}</h2>
              <p>{form.description}</p>
              <div className="meta">
                <span>{form.createdAt ? new Date(form.createdAt).toLocaleDateString() : ''}</span>
              </div>
              <div style={{display:'flex', gap:'8px', marginTop:'8px'}}>
                <Link to={`/forms/${form.id}`} className="primary-btn" style={{ fontSize: '13px', padding: '6px 12px' }}>
                  Open
                </Link>
                <button onClick={() => deleteForm(form.id)} style={{padding:'6px 12px',background:'#dc2626',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Forms;
