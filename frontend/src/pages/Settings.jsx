import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function CMSSettings() {
  const [settings, setSettings] = useState({
    app_name: 'Formify',
    app_tagline: 'Forms + Sheets',
    welcome_message: 'Login to your account',
    primary_color: '#6d28d9',
  });
  const [saving, setSaving] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/settings`).then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const handleSave = async (key) => {
    setSaving(key);
    try {
      await axios.put(
        `${API_URL}/settings`,
        { key, value: settings[key] },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      setMessages(prev => ({ ...prev, [key]: '✅ Saved!' }));
      setTimeout(() => {
        setMessages(prev => ({ ...prev, [key]: '' }));
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessages(prev => ({ ...prev, [key]: `❌ Error: ${err.response?.data?.message || err.message}` }));
    } finally {
      setSaving(null);
    }
  };

  const fields = [
    { key: 'app_name', label: 'Application Name', placeholder: 'Formify' },
    { key: 'app_tagline', label: 'Tagline', placeholder: 'Forms + Sheets' },
    { key: 'welcome_message', label: 'Login Welcome Message', placeholder: 'Login to your account' },
    { key: 'primary_color', label: 'Primary Color', placeholder: '#6d28d9', type: 'color' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>CMS Settings</h1>
        <p>Modify the appearance and static text of the application.</p>
      </div>
      <div style={{ maxWidth: 600 }}>
        {fields.map(f => (
          <div key={f.key} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>
              {f.label}
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {f.type === 'color' ? (
                <input
                  type="color"
                  value={settings[f.key] || '#6d28d9'}
                  onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: 48, height: 36, border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }}
                />
              ) : (
                <input
                  type="text"
                  value={settings[f.key] || ''}
                  onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
                />
              )}
              <button
                onClick={() => handleSave(f.key)}
                disabled={saving === f.key}
                style={{ padding: '8px 16px', background: '#6d28d9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              >
                {saving === f.key ? 'Saving...' : 'Save'}
              </button>
            </div>
            {messages[f.key] && (
              <p style={{ fontSize: '12px', color: messages[f.key].includes('❌') ? '#dc2626' : '#16a34a', marginTop: '6px' }}>
                {messages[f.key]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CMSSettings;