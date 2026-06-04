import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.first_name, form.last_name, form.email, form.password)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Regjistrimi deshtoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',background:'#f8fafc'}}>
      <div className="panel" style={{width:'100%',maxWidth:'420px'}}>
        <div className="page-header" style={{textAlign:'center'}}>
          <h1 style={{color:'#6d28d9'}}>ChatterHub</h1>
          <p>Krijo llogari te re</p>
        </div>
        {error && <p style={{background:'#fef2f2',color:'#dc2626',padding:'10px',borderRadius:'6px',marginBottom:'16px',fontSize:'14px'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',marginBottom:'6px',fontWeight:'600',fontSize:'14px'}}>Emri</label>
            <input type="text" name="first_name" value={form.first_name} onChange={handleChange} style={{width:'100%',padding:'10px 12px',border:'1px solid #d1d5db',borderRadius:'6px',fontSize:'14px',boxSizing:'border-box'}} placeholder="Emri" required />
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',marginBottom:'6px',fontWeight:'600',fontSize:'14px'}}>Mbiemri</label>
            <input type="text" name="last_name" value={form.last_name} onChange={handleChange} style={{width:'100%',padding:'10px 12px',border:'1px solid #d1d5db',borderRadius:'6px',fontSize:'14px',boxSizing:'border-box'}} placeholder="Mbiemri" required />
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',marginBottom:'6px',fontWeight:'600',fontSize:'14px'}}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={{width:'100%',padding:'10px 12px',border:'1px solid #d1d5db',borderRadius:'6px',fontSize:'14px',boxSizing:'border-box'}} placeholder="email@example.com" required />
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',marginBottom:'6px',fontWeight:'600',fontSize:'14px'}}>Fjalekalimi</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} style={{width:'100%',padding:'10px 12px',border:'1px solid #d1d5db',borderRadius:'6px',fontSize:'14px',boxSizing:'border-box'}} placeholder="password" required />
          </div>
          <button type="submit" className="primary-btn" style={{width:'100%',padding:'12px',fontSize:'16px'}} disabled={loading}>
            {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'20px',fontSize:'14px',color:'#6b7280'}}>
          Ke llogari? <a href="/login" style={{color:'#6d28d9',fontWeight:'600'}}>Kycu</a>
        </p>
      </div>
    </div>
  )
}

export default Register
