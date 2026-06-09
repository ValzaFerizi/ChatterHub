import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000";

function Forms() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const forms = [
    {
      id: "1",
      title: "Customer Feedback Form",
      description: "Collect customer opinions and ratings.",
      responses: 24,
      createdAt: "2026-06-03",
    },
    {
      id: "2",
      title: "Job Application Form",
      description: "Collect job applicants.",
      responses: 12,
      createdAt: "2026-06-02",
    },
  ];

  const handleExport = async (format) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        `${API_URL}/export/${format}`,
        format === "csv"
          ? { data: forms, fields: ["id", "title", "description", "responses", "createdAt"] }
          : { data: forms },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `forms-export.${format === "excel" ? "xlsx" : format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`✅ Forms u eksportuan si ${format.toUpperCase()}!`);
    } catch (err) {
      setMessage(`❌ Export dështoi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-top">
        <div>
          <h1>Forms</h1>
          <p>Create and manage your forms.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => handleExport("csv")}
            disabled={loading}
            style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            {loading ? "..." : "Export CSV"}
          </button>
          <button
            onClick={() => handleExport("excel")}
            disabled={loading}
            style={{ padding: "8px 16px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            {loading ? "..." : "Export Excel"}
          </button>
          <button
            onClick={() => handleExport("json")}
            disabled={loading}
            style={{ padding: "8px 16px", backgroundColor: "#FF9800", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            {loading ? "..." : "Export JSON"}
          </button>
          <Link className="primary-btn" to="/create-form">
            New Form
          </Link>
        </div>
      </div>
      {message && (
        <p style={{ padding: "10px", borderRadius: "6px", backgroundColor: message.includes("✅") ? "#f0fdf4" : "#fef2f2", color: message.includes("✅") ? "#16a34a" : "#dc2626", marginBottom: "16px" }}>
          {message}
        </p>
      )}
      <div className="forms-grid">
        {forms.map((form) => (
          <div className="form-card" key={form.id}>
            <h2>{form.title}</h2>
            <p>{form.description}</p>
            <div className="meta">
              <span>{form.responses} responses</span>
              <span>{form.createdAt}</span>
            </div>
            <button>Open Form</button>
          </div>
        ))}
      </div>
    </div>
  );
}

  export default Forms;