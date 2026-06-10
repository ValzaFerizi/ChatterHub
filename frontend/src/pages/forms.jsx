import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";

const API_URL = "http://localhost:5000/api";

function Forms() {
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
  api.get("/forms")
    .then(async res => {
      const data = res.data.data || res.data.forms || res.data || [];
      const formsWithCount = await Promise.all(
        data.map(async (form) => {
          try {
            const r = await api.get(`/responses/forms/${form.id}/responses`);
            return { ...form, responseCount: (r.data.data || []).length };
          } catch {
            return { ...form, responseCount: 0 };
          }
        })
      );
      setForms(formsWithCount);
    })
    .catch(() => setForms([]))
    .finally(() => setLoadingForms(false));
}, []);

  const handleDelete = async (formId) => {
    if (!window.confirm("A je i sigurt që dëshiron ta fshish këtë formë?")) return;
    try {
      await api.delete(`/forms/${formId}`);
      setForms(prev => prev.filter(f => f.id !== formId));
    } catch (err) {
      alert("Gabim gjatë fshirjes: " + (err.response?.data?.message || err.message));
    }
  };

  const handleExport = async (format) => {
    try {
      setLoading(true);
      setMessage("");
      setProgress(0);
      setOpenDropdown(null);
      const response = await axios.post(
        `${API_URL}/export/${format}`,
        format === "csv"
          ? { data: forms, fields: ["id", "title", "description", "createdAt"] }
          : { data: forms },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          responseType: "blob",
          onDownloadProgress: (e) => {
            setProgress(Math.round((e.loaded * 100) / (e.total || 1)));
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
        <Link className="primary-btn" to="/create-form">New Form</Link>
      </div>

      <ExportProgress loading={loading} message={message} progress={progress} />

      <div className="forms-grid">
        {loadingForms ? (
          <p style={{ color: "#6b7280" }}>Duke ngarkuar format...</p>
        ) : forms.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Nuk ka forma akoma. Krijo një të re!</p>
        ) : (
          forms.map((form) => (
            <div className="form-card" key={form.id}>
              <h2>{form.title}</h2>
              <p>{form.description}</p>
              <div className="meta">
                <span>{form.responseCount || 0} responses</span>
                <span>{new Date(form.createdAt || form.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center", flexWrap: "wrap" }}>
                
                {/* Open */}
                <Link
                  to={`/forms/${form.id}`}
                  style={{ padding: "6px 12px", background: "#6d28d9", color: "#fff", borderRadius: "6px", cursor: "pointer", fontSize: "13px", textDecoration: "none" }}
                >
                  Open
                </Link>

                {/* Export dropdown */}
                <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === form.id ? null : form.id)}
                    style={{ fontSize: "13px", padding: "6px 12px", background: "#f3f4f6", border: "0.5px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", color: "#6b7280" }}
                  >
                    ⬇ Export
                  </button>
                  {openDropdown === form.id && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 4px)", left: 0,
                      background: "white", border: "0.5px solid #e5e7eb",
                      borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 100, minWidth: "150px"
                    }}>
                      <button onClick={() => handleExport("csv")}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                        📄 Export CSV
                      </button>
                      <button onClick={() => handleExport("excel")}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                        📊 Export Excel
                      </button>
                      <button onClick={() => handleExport("json")}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                        📋 Export JSON
                      </button>
                    </div>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(form.id)}
                  style={{ padding: "6px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                >
                  🗑 Delete
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