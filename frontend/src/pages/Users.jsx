import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user: currentUser } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users')
      setUsers(res.data)
    } catch (err) {
      setError('Nuk u ngarkuan users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('A je i sigurt?')) return
    try {
      await axios.patch(`/api/auth/users/${id}/deactivate`)
      fetchUsers()
    } catch (err) {
      alert('Gabim gjate deaktivizimit')
    }
  }

  const handleRoleChange = async (userId, roleName) => {
    if (userId === currentUser?.id) return
    try {
      await axios.patch('/api/auth/users/role', { userId, roleName })
      fetchUsers()
    } catch (err) {
      alert('Gabim gjate ndryshimit te rolit')
    }
  }

  if (loading) return <div className="page-header"><p>Duke u ngarkuar...</p></div>
  if (error) return <div className="page-header"><p style={{color:'#dc2626'}}>{error}</p></div>

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <p>Menaxhimi i perdoruesve.</p>
      </div>
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Emri</th>
              <th>Mbiemri</th>
              <th>Email</th>
              <th>Aktiv</th>
              <th>Roli</th>
              <th>Veprimet</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const currentRole = user.roles?.[0]?.name || 'user'
              const isCurrentUser = currentUser?.id === user.id
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.is_active ? '✅' : '❌'}</td>
                  <td>
                    {!isCurrentUser ? (
                      <select
                        value={currentRole}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        style={{padding:'4px 8px',borderRadius:'4px',border:'1px solid #d1d5db',fontSize:'13px'}}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span style={{fontSize:'13px',color:'#6b7280'}}>{currentRole}</span>
                    )}
                  </td>
                  <td>
                    {!isCurrentUser && user.is_active && (
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        style={{padding:'4px 12px',background:'#dc2626',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'13px'}}>
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
