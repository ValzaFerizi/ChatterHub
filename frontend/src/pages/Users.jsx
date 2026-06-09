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
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await axios.patch(`/api/auth/users/${id}/deactivate`)
      fetchUsers()
    } catch (err) {
      alert('Error during deactivation')
    }
  }

  const handleRoleChange = async (userId, roleName) => {
    if (userId === currentUser?.id) return
    try {
      await axios.patch('/api/auth/users/role', { userId, roleName })
      fetchUsers()
    } catch (err) {
      alert('Error changing role')
    }
  }

  if (loading) return <div className="page-header"><p>Loading...</p></div>
  if (error) return <div className="page-header"><p style={{color:'#dc2626'}}>{error}</p></div>

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <p>User Management</p>
      </div>
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Active</th>
              <th>Role</th>
              <th>Actions</th>
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
