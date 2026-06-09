import { useState, useEffect } from "react";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";
import { useSocket } from "../hooks/useSocket";

const API_URL = "http://localhost:5000";

function Sheets() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const socketRef = useSocket();

  const sheets = [
    { id: "1", name: "Customer Feedback Responses", linkedForm: "Customer Feedback Form", rows: 24, columns: 6, updatedAt: "2026-06-03" },
    { id: "2", name: "Job Applications", linkedForm: "Job Application Form", rows: 12, columns: 8, updatedAt: "2026-06-02" },
  ];

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("sheet:join", { sheetId: "main" });
    socket.on("cell:updated", ({ cellId, value, updatedBy }) => {
      console.log(`Cell ${cellId} updated by ${updatedBy}: ${value}`);
    });
    socket.on("sheet:user_joined", ({ username }) => {
      console.log(`${username} opened the sheet`);
    });
    return () => socket.emit("sheet:leave", { sheetId: "main" });
  }, [socketRef]);

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
      setMessage(`✅ Sheets exported as ${format.toUpperCase()}!`);
    } catch (err) {
      setMessage(`❌ Export failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Sheets</h1>
          <p>Response tables connected to forms.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => handleExport("csv")} disabled={loading} style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Export CSV
          </button>
          <button onClick={() => handleExport("excel")} disabled={loading} style={{ padding: "8px 16px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Export Excel
          </button>
          <button onClick={() => handleExport("json")} disabled={loading} style={{ padding: "8px 16px", backgroundColor: "#FF9800", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Export JSON
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sheets;
