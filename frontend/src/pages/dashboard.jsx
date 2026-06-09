import { useState, useEffect } from 'react';
import api from '../api/api';

function Dashboard() {
  const [stats, setStats] = useState({ forms: 0, responses: 0, users: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/forms').catch(() => ({ data: [] })),
      api.get('/audit').catch(() => ({ data: [] })),
      api.get('/auth/users').catch(() => ({ data: [] }))
    ]).then(([formsRes, auditRes, usersRes]) => {
      const forms = formsRes.data.data || formsRes.data.forms || formsRes.data || [];
      const totalResponses = forms.reduce((sum, f) => sum + (f.responses?.length || 0), 0);
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      setStats({ forms: forms.length, responses: totalResponses, users: users.length });
      const logs = Array.isArray(auditRes.data) ? auditRes.data : [];
      setActivity(logs.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of forms, sheets, and responses.</p>
      </div>

      <div className="stats">
        <div className="card">
          <p>Total Forms</p>
          <h2>{loading ? '...' : stats.forms}</h2>
        </div>
        <div className="card">
          <p>Total Responses</p>
          <h2>{loading ? '...' : stats.responses}</h2>
        </div>
        <div className="card">
          <p>Total Users</p>
          <h2>{loading ? '...' : stats.users}</h2>
        </div>
        <div className="card">
          <p>Status</p>
          <h2>🟢</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Activity</h2>
        {loading ? (
          <p>Loading...</p>
        ) : activity.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>No activity yet.</p>
        ) : (
          activity.map((log, i) => {
            let message = '';
            let icon = '📌';
            switch(log.action) {
              case 'LOGIN':           icon = '🔐'; message = 'A user logged in'; break;
              case 'REGISTER':        icon = '👤'; message = 'A new user registered'; break;
              case 'LOGOUT':          icon = '🚪'; message = 'A user logged out'; break;
              case 'CREATE_FORM':     icon = '📝'; message = `New form created: "${log.new_value}"`; break;
              case 'UPDATE_FORM':     icon = '✏️'; message = `Form updated: "${log.new_value}"`; break;
              case 'DELETE_FORM':     icon = '🗑️'; message = `Form deleted: "${log.old_value}"`; break;
              case 'SUBMIT_FORM':     icon = '✅'; message = 'Someone submitted a form'; break;
              case 'CREATE_QUESTION': icon = '❓'; message = 'New question added'; break;
              case 'DELETE_QUESTION': icon = '❌'; message = 'Question deleted'; break;
              case 'UPDATE_ROLE':     icon = '👑'; message = 'User role updated'; break;
              case 'DEACTIVATE_USER': icon = '🚫'; message = 'A user was deactivated'; break;
              default: icon = '📌'; message = log.action;
            }
            return (
              <p key={i} style={{ fontSize: '14px', padding: '8px 0', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>
                {icon} {message}
                <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '8px' }}>
                  — {new Date(log.created_at).toLocaleString()}
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
