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
  api.get(`/forms/${selectedForm.id}/responses`)
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
    responses.forEach(r => {
      r.answers?.forEach(a => {
        if (a.question?.text) allKeys.add(a.question.text);
      });
    });
    return Array.from(allKeys);
  };

  const getAnswer = (response, questionText) => {
    const answer = response.answers?.find(a => a.question?.text === questionText);
    if (!answer) return "—";
    return answer.valueText || answer.valueNumber || JSON.stringify(answer.valueJson) || "—";
  };

  const columns = getColumns();

  return (
    <div>
      <div className="page-header">
        <h1>Sheets</h1>
        <p>Përgjigjet e formave në kohë reale.</p>
      </div>

      {!loading && forms.length > 0 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {forms.map(form => (
            <button
              key={form.id}
              onClick={() => setSelectedForm(form)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1.5px solid",
                borderColor: selectedForm?.id === form.id ? "#6d28d9" : "#e5e7eb",
                background: selectedForm?.id === form.id ? "#6d28d9" : "#fff",
                color: selectedForm?.id === form.id ? "#fff" : "#374151",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500
              }}
            >
              {form.title}
            </button>
          ))}
        </div>
      )}

      <div className="table-box">
        {loading ? (
          <p style={{ padding: "20px", color: "#6b7280" }}>Duke ngarkuar format...</p>
        ) : forms.length === 0 ? (
          <p style={{ padding: "20px", color: "#6b7280" }}>Nuk ka forma akoma.</p>
        ) : responses.length === 0 ? (
          <p style={{ padding: "20px", color: "#6b7280" }}>
            Nuk ka përgjigje akoma për <strong>{selectedForm?.title}</strong>.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Submitted At</th>
                {columns.map((col, i) => <th key={i}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {responses.map((response, i) => (
                <tr key={response.id}>
                  <td>{i + 1}</td>
                  <td>{new Date(response.submittedAt || response.created_at).toLocaleString()}</td>
                  {columns.map((col, j) => (
                    <td key={j}>{getAnswer(response, col)}</td>
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