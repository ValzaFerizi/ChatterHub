import { useState, useEffect } from 'react';
import api from '../api/api';

function Dashboard() {
  const [stats, setStats] = useState({ forms: 0, responses: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/forms').catch(() => ({ data: { forms: [] } })),
      api.get('/audit').catch(() => ({ data: [] }))
    ]).then(([formsRes, auditRes]) => {
      const forms = formsRes.data.data || formsRes.data.forms || formsRes.data || [];
      const totalResponses = forms.reduce((sum, f) => sum + (f.responses?.length || 0), 0);
      setStats({ forms: forms.length, responses: totalResponses });
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
          <p>Active Users</p>
          <h2>1</h2>
        </div>
        <div className="card">
          <p>Status</p>
          <h2>🟢</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Activity</h2>
        {loading ? (
          <p>Duke u ngarkuar...</p>
        ) : activity.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Nuk ka aktivitet akoma.</p>
        ) : (
         activity.map((log, i) => {
  let message = '';
  let icon = '📌';

  switch(log.action) {
    case 'LOGIN':       icon = '🔐'; message = 'Një user u kyç në sistem'; break;
    case 'REGISTER':    icon = '👤'; message = 'Një user i ri u regjistrua'; break;
    case 'LOGOUT':      icon = '🚪'; message = 'Një user u çkyç'; break;
    case 'CREATE_FORM': icon = '📝'; message = `Forma e re u krijua: "${log.new_value}"`; break;
    case 'UPDATE_FORM': icon = '✏️'; message = `Forma u përditësua: "${log.new_value}"`; break;
    case 'DELETE_FORM': icon = '🗑️'; message = `Forma u fshi: "${log.old_value}"`; break;
    case 'SUBMIT_FORM': icon = '✅'; message = 'Dikush plotësoi një formë'; break;
    case 'CREATE_QUESTION': icon = '❓'; message = 'Pyetje e re u shtua'; break;
    case 'DELETE_QUESTION': icon = '❌'; message = 'Pyetje u fshi'; break;
    case 'UPDATE_ROLE':  icon = '👑'; message = `Roli u ndryshua`; break;
    case 'DEACTIVATE_USER': icon = '🚫'; message = 'Një user u deaktivizua'; break;
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