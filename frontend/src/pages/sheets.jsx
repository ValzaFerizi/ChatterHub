import { useState, useEffect } from "react";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";
import { useSocket } from "../hooks/useSocket";

const API_URL = "http://localhost:5000/api";

function Sheets() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const socketRef = useSocket();

  useEffect(() => {
    axios.get(`${API_URL}/sheets`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    })
      .then(res => setSheets(res.data.sheets || []))
      .catch(() => setSheets([]))
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("sheet:join", { sheetId: "main" });
    socket.on("cell:updated", ({ cellId, value, updatedBy }) => {
      console.log(`Cell ${cellId} u ndryshua nga ${updatedBy}: ${value}`);
    });
    socket.on("sheet:user_joined", ({ username }) => {
      console.log(`${username} hapi sheet-in`);
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
          ? { data: sheets, fields: ["id", "name", "form_id", "created_at"] }
          : { data: sheets },
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
              <th>Sheet Name</th>
              <th>Form ID</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr><td colSpan="3" style={{ textAlign: "center", color: "#6b7280" }}>Duke ngarkuar...</td></tr>
            ) : sheets.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: "center", color: "#6b7280" }}>Nuk ka sheets akoma.</td></tr>
            ) : (
              sheets.map((sheet) => (
                <tr key={sheet.id}>
                  <td>{sheet.name}</td>
                  <td>{sheet.form_id || "—"}</td>
                  <td>{new Date(sheet.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sheets;