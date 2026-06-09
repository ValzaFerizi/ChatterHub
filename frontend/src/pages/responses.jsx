import { useState } from "react";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";

const API_URL = "http://localhost:5000";

function Responses() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const responses = [
    { id: "1", form: "Customer Feedback Form", user: "John Doe", submitted_at: "2026-06-03", status: "Completed" },
    { id: "2", form: "Customer Feedback Form", user: "Jane Doe", submitted_at: "2026-06-03", status: "Completed" },
    { id: "3", form: "Job Application Form", user: "Bob Smith", submitted_at: "2026-06-02", status: "Pending" },
  ];

  const handleExport = async (format) => {
    try {
      setLoading(true);
      setMessage("");
      setProgress(0);

      const response = await axios.post(
        `${API_URL}/export/${format}`,
        format === "csv"
          ? { data: responses, fields: ["id", "form", "user", "submitted_at", "status"] }
          : { data: responses },
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
      link.setAttribute("download", `responses-export.${format === "excel" ? "xlsx" : format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
      setMessage(`✅ Responses u eksportuan si ${format.toUpperCase()}!`);
    } catch (err) {
      setMessage(`❌ Export dështoi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Responses</h1>
          <p>View and export form responses.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => handleExport("csv")} disabled={loading}
            style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            {loading ? "..." : "Export CSV"}
          </button>
          <button onClick={() => handleExport("excel")} disabled={loading}
            style={{ padding: "8px 16px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            {loading ? "..." : "Export Excel"}
          </button>
          <button onClick={() => handleExport("json")} disabled={loading}
            style={{ padding: "8px 16px", backgroundColor: "#FF9800", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            {loading ? "..." : "Export JSON"}
          </button>
        </div>
      </div>

      <ExportProgress loading={loading} message={message} progress={progress} />

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Form</th>
              <th>User</th>
              <th>Submitted At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr key={response.id}>
                <td>{response.form}</td>
                <td>{response.user}</td>
                <td>{response.submitted_at}</td>
                <td>{response.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Responses;