import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useSocket } from '../hooks/useSocket'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const socketRef = useSocket()
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [toasts, setToasts] = useState([])
  const inputRef = useRef()
  const bellRef = useRef()

  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return
    socket.on('notification', ({ message, type }) => {
      setNotifications(prev => [
        { id: Date.now(), message, type, read: false, time: new Date() },
        ...prev
      ])
      setToasts(prev => [...prev, message])
      setTimeout(() => setToasts(prev => prev.slice(1)), 3000)
    })
    return () => socket.off('notification')
  }, [socketRef])

  const handleBell = () => {
    setShowDropdown(prev => !prev)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate(`/search?q=${e.target.value.trim()}`)
      inputRef.current.value = ''
    }
  }

  return (
    <header className="navbar">
      <input
        ref={inputRef}
        placeholder="Search forms, sheets..."
        onKeyDown={handleSearch}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user && (
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {user.first_name} {user.last_name}
          </span>
        )}

        {/* Bell */}
        <div ref={bellRef} style={{ position: 'relative' }}>
          <div
            style={{ position: 'relative', cursor: 'pointer', fontSize: '20px' }}
            onClick={handleBell}
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

          {/* Dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#fff', border: '0.5px solid #e5e7eb',
              borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              minWidth: '280px', maxHeight: '320px', overflowY: 'auto',
              zIndex: 1000
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #f3f4f6', fontWeight: 500, fontSize: '14px', color: '#111' }}>
                Njoftimet
              </div>
              {notifications.length === 0 ? (
                <p style={{ padding: '20px 16px', color: '#6b7280', fontSize: '13px', textAlign: 'center' }}>
                  Nuk ka njoftime akoma.
                </p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '10px 16px',
                    borderBottom: '0.5px solid #f9fafb',
                    background: n.read ? '#fff' : '#f5f3ff',
                    fontSize: '13px', color: '#374151'
                  }}>
                    🔔 {n.message}
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                      {new Date(n.time).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{ padding: '6px 16px', background: '#6d28d9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
        >
          Logout
        </button>
      </div>

      {/* Toasts */}
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