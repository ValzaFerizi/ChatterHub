import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSocket } from '../hooks/useSocket'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const socketRef = useSocket()
  const [unread, setUnread] = useState(0)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return
    socket.on('notification', ({ message }) => {
      setUnread(prev => prev + 1)
      setToasts(prev => [...prev, message])
      setTimeout(() => setToasts(prev => prev.slice(1)), 3000)
    })
    return () => socket.off('notification')
  }, [socketRef])

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

        <div
          style={{ position: 'relative', cursor: 'pointer', fontSize: '20px' }}
          onClick={() => setUnread(0)}
        >
          🔔
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: '#dc2626', color: '#fff',
              borderRadius: '50%', fontSize: '11px',
              width: 18, height: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {unread}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{ padding: '6px 16px', background: '#6d28d9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
          Logout
        </button>
      </div>

      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        {toasts.map((t, i) => (
          <div key={i} style={{
            background: '#1f2937', color: '#fff',
            padding: '10px 16px', borderRadius: '8px',
            marginTop: '8px', fontSize: '14px'
          }}>
            🔔 {t}
          </div>
        ))}
      </div>
    </header>
  )
}

export default Navbar