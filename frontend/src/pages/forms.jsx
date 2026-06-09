import api from '../api/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Forms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/forms')
      .then(res => setForms(res.data.data || res.data.forms || res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const deleteForm = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/forms/${id}`);
      setForms(forms.filter(f => f.id !== id));
    } catch (err) {
      alert('Gabim gjatë fshirjes');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div>
      <div className="page-top">
        <div>
          <h1>Forms</h1>
          <p>Create and manage your forms.</p>
        </div>
        <Link className="primary-btn" to="/create-form">New Form</Link>
      </div>

      <div className="forms-grid">
        {forms.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <p>Nuk ka forma akoma.</p>
            <Link className="primary-btn" to="/create-form" style={{ marginTop: '12px', display: 'inline-block' }}>
              Krijo formën e parë
            </Link>
          </div>
        ) : (
          forms.map((form) => (
            <div className="form-card" key={form.id}>
              <h2>{form.title}</h2>
              <p>{form.description}</p>
              <div className="meta">
                <span>{form.responses?.length || 0} responses</span>
                <span>{new Date(form.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <Link to={`/forms/${form.id}`} className="primary-btn" style={{ fontSize: '13px', padding: '6px 12px' }}>
                  Open
                </Link>
                <button onClick={() => deleteForm(form.id)}
                  style={{ fontSize: '13px', padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Forms;