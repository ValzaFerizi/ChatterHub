import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";

const API_URL = "/api";

function Forms() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);

  const forms = [
    { id: "1", title: "Customer Feedback Form", description: "Collect customer opinions and ratings.", responses: 24, createdAt: "2026-06-03" },
    { id: "2", title: "Job Application Form", description: "Collect job applicants.", responses: 12, createdAt: "2026-06-02" },
  ];

  const handleExport = async (format) => {
    try {
      setLoading(true);
      setMessage("");
      setProgress(0);
      setOpenDropdown(null);
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
      setMessage(`✅ Forms u eksportuan si ${format.toUpperCase()}!`);
    } catch (err) {
      setMessage(`❌ Export dështoi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={() => setOpenDropdown(null)}>
      <div className="page-top">
        <div>
          <h1>Forms</h1>
          <p>Create and manage your forms.</p>
        </div>
        <Link className="primary-btn" to="/create-form">
          New Form
        </Link>
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
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
              <button style={{ padding: '6px 12px', background: '#6d28d9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                Open Form
              </button>
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === form.id ? null : form.id)}
                  style={{ fontSize: '13px', padding: '6px 12px', background: '#f3f4f6', border: '0.5px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}
                >
                  ⬇ Export
                </button>
                {openDropdown === form.id && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                    background: 'white', border: '0.5px solid #e5e7eb',
                    borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 100, minWidth: '150px'
                  }}>
                    <button onClick={() => handleExport("csv")}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '9px 14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', color: '#111' }}>
                      📄 Export CSV
                    </button>
                    <button onClick={() => handleExport("excel")}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '9px 14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', color: '#111' }}>
                      📊 Export Excel
                    </button>
                    <button onClick={() => handleExport("json")}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '9px 14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', color: '#111' }}>
                      📋 Export JSON
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

   export default Forms;