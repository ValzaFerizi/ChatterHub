import { useState } from "react";
import axios from "axios";
import ExportProgress from "../components/ExportProgress";

const API_URL = "http://localhost:5000";

function Users() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const users = [
    { id: "1", first_name: "John", last_name: "Doe", email: "john@example.com", role: "Admin", is_active: true, created_at: "2026-06-01" },
    { id: "2", first_name: "Jane", last_name: "Doe", email: "jane@example.com", role: "User", is_active: true, created_at: "2026-06-02" },
    { id: "3", first_name: "Bob", last_name: "Smith", email: "bob@example.com", role: "User", is_active: false, created_at: "2026-06-03" },
  ];

  const handleExport = async (format) => {
    try {
      setLoading(true);
      setMessage("");
      setProgress(0);

      const response = await axios.post(
        `${API_URL}/export/${format}`,
        format === "csv"
          ? { data: users, fields: ["id", "first_name", "last_name", "email", "role", "is_active", "created_at"] }
          : { data: users },
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
      link.setAttribute("download", `users-export.${format === "excel" ? "xlsx" : format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
      setMessage(`✅ Users u eksportuan si ${format.toUpperCase()}!`);
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
          <h1>Users</h1>
          <p>Manage system users.</p>
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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? "✅" : "❌"}</td>
                <td>{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Users;