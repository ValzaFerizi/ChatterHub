import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate(`/search?q=${e.target.value.trim()}`)
    }
  }

  return (
    <header className="navbar">
      <input
        placeholder="Search forms, sheets..."
        onKeyDown={handleSearch}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user && (
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {user.first_name} {user.last_name}
          </span>
        )}
        <button
          onClick={handleLogout}
          style={{ padding: '6px 16px', background: '#6d28d9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
