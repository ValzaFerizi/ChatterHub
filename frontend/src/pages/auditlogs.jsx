import { useState, useEffect } from 'react'
import axios from 'axios'

function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/audit')
        setLogs(res.data)
      } catch (err) {
        setError('Nuk u ngarkuan audit logs')
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  if (loading) return <div className="page-header"><p>Duke u ngarkuar...</p></div>
  if (error) return <div className="page-header"><p style={{color:'#dc2626'}}>{error}</p></div>

  return (
    <div>
      <div className="page-header">
        <h1>Audit Logs</h1>
        <p>Regjistri i te gjitha veprimeve.</p>
      </div>
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Emri</th>
              <th>Veprimi</th>
              <th>Entiteti</th>
              <th>IP</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td>{log.user_id}</td>
                <td>{log.user_name}</td>
                <td>{log.action}</td>
                <td>{log.entity}</td>
                <td>{log.ip_address}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuditLogs
