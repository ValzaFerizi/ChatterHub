import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',background:'#f8fafc'}}>
      <div className="panel" style={{width:'100%',maxWidth:'420px'}}>
        <div className="page-header" style={{textAlign:'center'}}>
          <h1 style={{color:'#6d28d9'}}>Formify</h1>
          <p>Login to your account</p>
        </div>
        {error && <p style={{background:'#fef2f2',color:'#dc2626',padding:'10px',borderRadius:'6px',marginBottom:'16px',fontSize:'14px'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',marginBottom:'6px',fontWeight:'600',fontSize:'14px'}}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{width:'100%',padding:'10px 12px',border:'1px solid #d1d5db',borderRadius:'6px',fontSize:'14px',boxSizing:'border-box'}} placeholder="email@example.com" required />
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',marginBottom:'6px',fontWeight:'600',fontSize:'14px'}}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{width:'100%',padding:'10px 12px',border:'1px solid #d1d5db',borderRadius:'6px',fontSize:'14px',boxSizing:'border-box'}} placeholder="password" required />
          </div>
          <button type="submit" className="primary-btn" style={{width:'100%',padding:'12px',fontSize:'16px'}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'20px',fontSize:'14px',color:'#6b7280'}}>
          Don't have an account? <a href="/register" style={{color:'#6d28d9',fontWeight:'600'}}>Register</a>
        </p>
      </div>
    </div>
  )
}

export default Login
