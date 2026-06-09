import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";

const API_URL = "http://localhost:5000";

function Forms() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const forms = [
    { id: "1", title: "Customer Feedback Form", description: "Collect customer opinions and ratings.", responses: 24, createdAt: "2026-06-03" },
    { id: "2", title: "Job Application Form", description: "Collect job applicants.", responses: 12, createdAt: "2026-06-02" },
  ];

  const deleteForm = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/api/forms/${id}`);
      setMessage('Form deleted successfully');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleExport = async (format) => {
    try {
      setLoading(true);
      setMessage("");
      setProgress(0);
      const response = await axios.post(
        `${API_URL}/export/${format}`,
        format === "csv"
          ? { data: forms, fields: ["id", "title", "description", "responses", "createdAt"] }
          : { data: forms },
        {
          responseType: "blob",
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
      setLoading(false);
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
          <button onClick={() => handleExport("csv")} disabled={loading} style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Export CSV
          </button>
          <button onClick={() => handleExport("excel")} disabled={loading} style={{ padding: "8px 16px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Export Excel
          </button>
          <button onClick={() => handleExport("json")} disabled={loading} style={{ padding: "8px 16px", backgroundColor: "#FF9800", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Export JSON
          </button>
          <Link className="primary-btn" to="/create-form">New Form</Link>
        </div>
      </div>

      <ExportProgress loading={loading} message={message} progress={progress} />

      <div className="forms-grid">
        {forms.map((form) => (
          <div className="form-card" key={form.id}>
            <h2>{form.title}</h2>
            <p>{form.description}</p>
            <div className="meta">
              <span>{form.responses} responses</span>
              <span>{form.createdAt}</span>
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
        ))}
      </div>
    </div>
  );
}

export default Forms;
