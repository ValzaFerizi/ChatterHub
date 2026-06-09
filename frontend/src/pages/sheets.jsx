import { useState } from "react";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";

const API_URL = "http://localhost:5000";

function Sheets() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const sheets = [
    {
      id: "1",
      name: "Customer Feedback Responses",
      linkedForm: "Customer Feedback Form",
      rows: 24,
      columns: 6,
      updatedAt: "2026-06-03",
    },
    {
      id: "2",
      name: "Job Applications",
      linkedForm: "Job Application Form",
      rows: 12,
      columns: 8,
      updatedAt: "2026-06-02",
    },
  ];

  const handleExport = async (format) => {
    try {
      setLoading(true);
      setMessage("");
      setProgress(0);

      const response = await axios.post(
        `${API_URL}/export/${format}`,
        format === "csv"
          ? { data: sheets, fields: ["id", "name", "linkedForm", "rows", "columns", "updatedAt"] }
          : { data: sheets },
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
      link.setAttribute("download", `sheets-export.${format === "excel" ? "xlsx" : format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
      setMessage(`✅ Sheets u eksportuan si ${format.toUpperCase()}!`);
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
          <h1>Sheets</h1>
          <p>Response tables connected to forms.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
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
        </div>
      </div>

      <ExportProgress loading={loading} message={message} progress={progress} />

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Sheet Name</th>
              <th>Linked Form</th>
              <th>Rows</th>
              <th>Columns</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {sheets.map((sheet) => (
              <tr key={sheet.id}>
                <td>{sheet.name}</td>
                <td>{sheet.linkedForm}</td>
                <td>{sheet.rows}</td>
                <td>{sheet.columns}</td>
                <td>{sheet.updatedAt}</td>
              </tr>
            </thead>
            <tbody>
              {sheets.map((sheet) => (
                <tr key={sheet.id}>
                  <td>{sheet.name}</td>
                  <td>{sheet.form?.title || 'N/A'}</td>
                  <td>{sheet.cells?.length || 0}</td>
                  <td>{new Date(sheet.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

   export default Sheets;