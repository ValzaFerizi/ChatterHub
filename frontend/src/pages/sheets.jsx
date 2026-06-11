import { useState, useEffect } from "react";
import api from "../api/api";
import axios from "axios";
import { useSocket } from "../hooks/useSocket";
import ExportProgress from "../components/ExportProgress";

const API_URL = "http://localhost:5000/api";

function Sheets() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [exportProgress, setExportProgress] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const socketRef = useSocket();

  useEffect(() => {
    api.get("/forms")
      .then(res => {
        const data = res.data.data || res.data.forms || res.data || [];
        setForms(data);
        if (data.length > 0) setSelectedForm(data[0]);
      })
      .catch(() => setForms([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedForm) return;
    let cancelled = false;
    api.get(`/responses/forms/${selectedForm.id}/responses`)
      .then(res => { if (!cancelled) setResponses(res.data.data || []); })
      .catch(() => { if (!cancelled) setResponses([]); });
    return () => { cancelled = true; };
  }, [selectedForm]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedForm) return;
    socket.emit("sheet:join", { sheetId: selectedForm.id });
    socket.on("cell:updated", ({ cellId, value, updatedBy }) => {
      console.log(`Cell ${cellId} u ndryshua nga ${updatedBy}: ${value}`);
    });
    return () => socket.emit("sheet:leave", { sheetId: selectedForm.id });
  }, [socketRef, selectedForm]);

  const getColumns = () => {
    if (!responses?.length) return [];
    const allKeys = new Set();
    responses.forEach(r =>
      r.answers?.forEach(a => {
        if (a.question?.label) allKeys.add(a.question.label);
      })
    );
    return Array.from(allKeys);
  };

  const getAnswer = (response, questionLabel) => {
    const answer = response.answers?.find(a => a.question?.label === questionLabel);
    if (!answer) return "—";
    if (answer.valueText) return answer.valueText;
    if (answer.valueNumber !== null && answer.valueNumber !== undefined) return String(answer.valueNumber);
    if (answer.valueJson) return Array.isArray(answer.valueJson) ? answer.valueJson.join(", ") : JSON.stringify(answer.valueJson);
    return "—";
  };

  const handleExport = async (format) => {
    setExportLoading(true);
    setExportMessage("");
    setExportProgress(0);
    setOpenDropdown(null);
    try {
      const cols = getColumns();
      const reportData = responses.map((r, i) => {
        const row = {
          "#": i + 1,
          Forma: selectedForm.title,
          Data: new Date(r.submittedAt || r.created_at).toLocaleString(),
        };
        cols.forEach(col => { row[col] = getAnswer(r, col); });
        return row;
      });
      const fields = Object.keys(reportData[0] || {});
      const fileName = `raport-${selectedForm.title}-${new Date().toISOString().split("T")[0]}`;
      const endpoint =
        format === "csv" ? `${API_URL}/export/csv` :
        format === "excel" ? `${API_URL}/export/excel` :
        `${API_URL}/export/json`;
      const response = await axios.post(
        endpoint,
        format === "csv" ? { data: reportData, fields } : { data: reportData, sheetName: selectedForm.title },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          responseType: "blob",
          onDownloadProgress: (e) => { setExportProgress(Math.round((e.loaded * 100) / (e.total || 1))); }
        }
      );
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${fileName}.${format === "excel" ? "xlsx" : format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setExportProgress(100);
      setExportMessage(`✅ Raporti u eksportua si ${format.toUpperCase()}!`);
    } catch (err) {
      setExportMessage(`❌ Export dështoi: ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  const columns = getColumns();

  return (
    <div onClick={() => setOpenDropdown(null)}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Sheets</h1>
          <p>Përgjigjet e formave në kohë reale.</p>
        </div>
        {selectedForm && (
          <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setOpenDropdown(openDropdown === "export" ? null : "export")}
              disabled={exportLoading}
              style={{ padding: "8px 16px", background: "#6d28d9", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}
            >
              {exportLoading ? "Duke eksportuar..." : "⬇ Export Raport"}
            </button>
            {openDropdown === "export" && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "white", border: "0.5px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 100, minWidth: "180px" }}>
                <div style={{ padding: "8px 12px", fontSize: "11px", color: "#9ca3af", fontWeight: 500, borderBottom: "0.5px solid #f3f4f6" }}>
                  Raport: {selectedForm.title}
                </div>
                {[
                  { format: "csv", label: "📄 Export CSV" },
                  { format: "excel", label: "📊 Export Excel" },
                  { format: "json", label: "📋 Export JSON" },
                ].map(({ format, label }) => (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#111" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ExportProgress loading={exportLoading} message={exportMessage} progress={exportProgress} />

      {!loading && forms.length > 0 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {forms.map(form => (
            <button
              key={form.id}
              onClick={() => setSelectedForm(form)}
              style={{ padding: "8px 16px", borderRadius: "6px", border: "1.5px solid", borderColor: selectedForm?.id === form.id ? "#6d28d9" : "#e5e7eb", background: selectedForm?.id === form.id ? "#6d28d9" : "#fff", color: selectedForm?.id === form.id ? "#fff" : "#374151", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}
            >
              {form.title}
            </button>
          ))}
        </div>
      )}

      {selectedForm && !loading && (
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px", padding: "12px 16px", background: "#f9fafb", borderRadius: "8px", border: "0.5px solid #e5e7eb" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Përgjigje totale</div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#111" }}>{responses.length}</div>
          </div>
          <div style={{ width: "1px", background: "#e5e7eb" }} />
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Pyetje</div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#111" }}>{columns.length}</div>
          </div>
          <div style={{ width: "1px", background: "#e5e7eb" }} />
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>E fundit</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
              {responses.length > 0 ? new Date(responses[0].submittedAt || responses[0].created_at).toLocaleDateString() : "—"}
            </div>
          </div>
        </div>
      )}

      <div className="table-box">
        {loading ? (
          <p style={{ padding: "20px", color: "#6b7280" }}>Duke ngarkuar...</p>
        ) : forms.length === 0 ? (
          <p style={{ padding: "20px", color: "#6b7280" }}>Nuk ka forma akoma.</p>
        ) : responses.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📋</div>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>Nuk ka përgjigje akoma për <strong>{selectedForm?.title}</strong>.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", color: "#6b7280", fontWeight: 600, borderBottom: "1px solid #e5e7eb", width: "40px" }}>#</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", color: "#6b7280", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>Data</th>
                {columns.map((col, i) => (
                  <th key={i} style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", color: "#6b7280", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((response, i) => (
                <tr key={response.id} style={{ borderBottom: "0.5px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "10px 16px", fontSize: "13px", color: "#9ca3af" }}>{i + 1}</td>
                  <td style={{ padding: "10px 16px", fontSize: "13px", color: "#374151" }}>
                    {new Date(response.submittedAt || response.created_at).toLocaleString()}
                  </td>
                  {columns.map((col, j) => (
                    <td key={j} style={{ padding: "10px 16px", fontSize: "13px", color: "#374151" }}>{getAnswer(response, col)}</td>
                  ))}
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