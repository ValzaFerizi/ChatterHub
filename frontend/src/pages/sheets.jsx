import { useState, useEffect } from 'react';
import api from '../api/api';

function Sheets() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sheets')
      .then(res => setSheets(res.data.sheets || res.data || []))
      .catch(() => setSheets([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Sheets</h1>
        <p>Response tables connected to forms.</p>
      </div>

      <div className="table-box">
        {sheets.length === 0 ? (
          <p style={{ padding: '20px', color: '#6b7280' }}>Nuk ka sheets akoma.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sheet Name</th>
                <th>Linked Form</th>
                <th>Rows</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {sheets.map((sheet) => (
                <tr key={sheet.id}>
                  <td>{sheet.name}</td>
                  <td>{sheet.form?.title || 'N/A'}</td>
                  <td>{sheet.cells?.length || 0}</td>
                  <td>{new Date(sheet.updated_at).toLocaleDateString()}</td>
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