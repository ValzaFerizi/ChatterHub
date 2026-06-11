import { useState, useEffect } from "react";
import api from "../api/api";
import { useSocket } from "../hooks/useSocket";

function Sheets() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (answer.valueNumber !== null && answer.valueNumber !== undefined) return answer.valueNumber;
    if (answer.valueJson) {
      return Array.isArray(answer.valueJson)
        ? answer.valueJson.join(", ")
        : JSON.stringify(answer.valueJson);
    }
    return "—";
  };

  const columns = getColumns();

  return (
    <div>
      
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Sheets</h1>
          <p>Përgjigjet e formave në kohë reale.</p>
        </div>
        {selectedForm && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>Forma aktive</div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>{selectedForm.title}</div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
              {responses.length} përgjigje
            </div>
          </div>
        )}
      </div>

      
      {!loading && forms.length > 0 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {forms.map(form => (
            <button
              key={form.id}
              onClick={() => setSelectedForm(form)}
              style={{
                padding: "8px 16px", borderRadius: "6px", border: "1.5px solid",
                borderColor: selectedForm?.id === form.id ? "#6d28d9" : "#e5e7eb",
                background: selectedForm?.id === form.id ? "#6d28d9" : "#fff",
                color: selectedForm?.id === form.id ? "#fff" : "#374151",
                cursor: "pointer", fontSize: "13px", fontWeight: 500,
                transition: "all 0.15s"
              }}
            >
              {form.title}
            </button>
          ))}
        </div>
      )}

      {selectedForm && !loading && (
        <div style={{
          display: "flex", gap: "16px", marginBottom: "16px",
          padding: "12px 16px", background: "#f9fafb",
          borderRadius: "8px", border: "0.5px solid #e5e7eb"
        }}>
          <div>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Përgjigje totale</span>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#111" }}>{responses.length}</div>
          </div>
          <div style={{ width: "1px", background: "#e5e7eb" }} />
          <div>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Pyetje</span>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#111" }}>{columns.length}</div>
          </div>
          <div style={{ width: "1px", background: "#e5e7eb" }} />
          <div>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>E fundit</span>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
              {responses.length > 0
                ? new Date(responses[0].submittedAt || responses[0].created_at).toLocaleDateString()
                : "—"}
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
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Nuk ka përgjigje akoma për <strong>{selectedForm?.title}</strong>.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", color: "#6b7280", fontWeight: 600, borderBottom: "1px solid #e5e7eb", width: "40px" }}>#</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", color: "#6b7280", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>Data</th>
                {columns.map((col, i) => (
                  <th key={i} style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", color: "#6b7280", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>
                    {col}
                  </th>
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
                    <td key={j} style={{ padding: "10px 16px", fontSize: "13px", color: "#374151" }}>
                      {getAnswer(response, col)}
                    </td>
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