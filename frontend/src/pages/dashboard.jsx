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
  const getInfo = (action) => {
    switch(action) {
      case 'LOGIN':           return { icon: '🔐', message: 'Një user u kyç në sistem' };
      case 'REGISTER':        return { icon: '👤', message: 'Një user i ri u regjistrua' };
      case 'LOGOUT':          return { icon: '🚪', message: 'Një user u çkyç' };
      case 'CREATE_FORM':     return { icon: '📝', message: `Forma e re u krijua: "${log.new_value}"` };
      case 'UPDATE_FORM':     return { icon: '✏️', message: `Forma u përditësua: "${log.new_value}"` };
      case 'DELETE_FORM':     return { icon: '🗑️', message: `Forma u fshi: "${log.old_value}"` };
      case 'SUBMIT_FORM':     return { icon: '✅', message: 'Dikush plotësoi një formë' };
      case 'CREATE_QUESTION': return { icon: '❓', message: 'Pyetje e re u shtua' };
      case 'DELETE_QUESTION': return { icon: '❌', message: 'Pyetje u fshi' };
      case 'UPDATE_ROLE':     return { icon: '👑', message: 'Roli u ndryshua' };
      case 'DEACTIVATE_USER': return { icon: '🚫', message: 'Një user u deaktivizua' };
      default:                return { icon: '📌', message: action };
    }
  };

  const { icon, message } = getInfo(log.action);

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