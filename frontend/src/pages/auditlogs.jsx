import { useState } from "react";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";

 const API_URL = "http://localhost:5000/api";

function AuditLogs() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const logs = [
    { id: "1", user: "John Doe", action: "LOGIN", entity: "Auth", ip_address: "192.168.1.1", created_at: "2026-06-03 10:00" },
    { id: "2", user: "Jane Doe", action: "CREATE_FORM", entity: "Form", ip_address: "192.168.1.2", created_at: "2026-06-03 10:15" },
    { id: "3", user: "John Doe", action: "EXPORT_DATA", entity: "Sheet", ip_address: "192.168.1.1", created_at: "2026-06-03 10:30" },
    { id: "4", user: "Bob Smith", action: "LOGIN_FAILED", entity: "Auth", ip_address: "192.168.1.3", created_at: "2026-06-03 11:00" },
  ];

  const handleExport = async (format) => {
    try {
      setLoading(true);
      setMessage("");
      setProgress(0);

      const response = await axios.post(
        `${API_URL}/export/${format}`,
        format === "csv"
          ? { data: logs, fields: ["id", "user", "action", "entity", "ip_address", "created_at"] }
          : { data: logs },
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
      link.setAttribute("download", `auditlogs-export.${format === "excel" ? "xlsx" : format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
      setMessage(`✅ Audit Logs u eksportuan si ${format.toUpperCase()}!`);
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
          <h1>Audit Logs</h1>
          <p>Track all system actions and events.</p>
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
              <th>User</th>
              <th>Action</th>
              <th>Entity</th>
              <th>IP Address</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.entity}</td>
                <td>{log.ip_address}</td>
                <td>{log.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AuditLogs;