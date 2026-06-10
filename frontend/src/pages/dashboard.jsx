import { useState, useEffect } from "react";
import api from "../api/api";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({ forms: 0, responses: 0, users: 0 });
  const [activity, setActivity] = useState([]);
  const [formsChartData, setFormsChartData] = useState([]);
  const [overviewChartData, setOverviewChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/forms").catch(() => ({ data: [] })),
      api.get("/audit").catch(() => ({ data: [] })),
      api.get("/auth/users").catch(() => ({ data: [] })),
    ]).then(([formsRes, auditRes, usersRes]) => {
      const forms = formsRes.data.data || formsRes.data.forms || formsRes.data || [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const logs = Array.isArray(auditRes.data) ? auditRes.data : [];
      const totalResponses = forms.reduce((sum, form) => sum + (form.responses?.length || 0), 0);

      setStats({ forms: forms.length, responses: totalResponses, users: users.length });
      setActivity(logs.slice(0, 5));
      setFormsChartData(
        forms.slice(0, 6).map((form, index) => ({
          name: form.title || form.name || `Form ${index + 1}`,
          responses: form.responses?.length || 0,
        }))
      );
      setOverviewChartData([
        { name: "Forms", value: forms.length },
        { name: "Responses", value: totalResponses },
        { name: "Users", value: users.length },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  const getInfo = (log) => {
    switch (log.action) {
      case "LOGIN":           return { icon: "🔐", message: "A user logged in" };
      case "REGISTER":        return { icon: "👤", message: "A new user registered" };
      case "LOGOUT":          return { icon: "🚪", message: "A user logged out" };
      case "CREATE_FORM":     return { icon: "📝", message: `New form created: "${log.new_value}"` };
      case "UPDATE_FORM":     return { icon: "✏️", message: `Form updated: "${log.new_value}"` };
      case "DELETE_FORM":     return { icon: "🗑️", message: `Form deleted: "${log.old_value}"` };
      case "SUBMIT_FORM":     return { icon: "✅", message: "Someone submitted a form" };
      case "CREATE_QUESTION": return { icon: "❓", message: "New question added" };
      case "DELETE_QUESTION": return { icon: "❌", message: "Question deleted" };
      case "UPDATE_ROLE":     return { icon: "👑", message: "User role updated" };
      case "DEACTIVATE_USER": return { icon: "🚫", message: "A user was deactivated" };
      default:                return { icon: "📌", message: log.action };
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of forms, sheets, and responses.</p>
      </div>

      <div className="stats">
        <div className="card">
          <p>Total Forms</p>
          <h2>{loading ? "..." : stats.forms}</h2>
        </div>
        <div className="card">
          <p>Total Responses</p>
          <h2>{loading ? "..." : stats.responses}</h2>
        </div>
        <div className="card">
          <p>Total Users</p>
          <h2>{loading ? "..." : stats.users}</h2>
        </div>
        <div className="card">
          <p>Status</p>
          <h2>🟢</h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "24px", marginBottom: "24px" }}>
        <div className="panel">
          <h2>Responses by Form</h2>
          {loading ? (
            <p>Loading chart...</p>
          ) : formsChartData.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: "14px" }}>No form data available.</p>
          ) : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={formsChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="responses" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="panel">
          <h2>System Overview</h2>
          {loading ? (
            <p>Loading chart...</p>
          ) : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={overviewChartData} dataKey="value" nameKey="name" outerRadius={100} label>
                    <Cell fill="#2563eb" />
                    <Cell fill="#16a34a" />
                    <Cell fill="#f97316" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Recent Activity</h2>
        {loading ? (
          <p>Loading...</p>
        ) : activity.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: "14px" }}>No activity yet.</p>
        ) : (
          activity.map((log, i) => {
            const { icon, message } = getInfo(log);
            return (
              <p key={i} style={{ fontSize: "14px", padding: "8px 0", borderBottom: "1px solid #f3f4f6", color: "#374151" }}>
                {icon} {message}
                <span style={{ color: "#9ca3af", fontSize: "12px", marginLeft: "8px" }}>
                  — {log.created_at ? new Date(log.created_at).toLocaleString() : "No date"}
                </span>
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Dashboard;