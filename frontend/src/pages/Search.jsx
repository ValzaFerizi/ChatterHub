import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Search() {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.isAdmin
  const query = searchParams.get('q') || ''

  useEffect(() => {
    doSearch(query, activeFilter)
  }, [query, activeFilter])

  const doSearch = async (q, type) => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/search?q=${q || ''}${type !== 'all' ? `&type=${type}` : ''}`)
      setResults(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const allFilters = [
    { id: 'all', label: 'All', icon: '🔍' },
    { id: 'forms', label: 'Forms', icon: '📋' },
    { id: 'users', label: 'Users', icon: '👤', adminOnly: true },
    { id: 'questions', label: 'Questions', icon: '❓' },
    { id: 'responses', label: 'Responses', icon: '✅' },
  ]

  const filters = allFilters.filter(f => !f.adminOnly || isAdmin)

  const totalResults = results ? Object.entries(results).reduce((sum, [key, arr]) => {
    if (activeFilter === 'all' && key === 'responses') return sum
    return sum + (arr?.length || 0)
  }, 0) : 0

  return (
    <div>
      <div className="page-header">
        <h1>Search</h1>
        <p>{query ? `Results for: "${query}" — ${totalResults} found` : 'Browse all data'}</p>
      </div>

      <div style={{display:'flex',gap:'24px'}}>
        <div style={{width:'180px',flexShrink:0}}>
          <div style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'10px',padding:'12px',position:'sticky',top:'20px'}}>
            <p style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'8px'}}>Filter by</p>
            {filters.map(f => {
              const count = f.id === 'all' ? totalResults : f.id === 'responses' && query ? 0 : (results?.[f.id]?.length || 0)
              return (
                <button key={f.id} onClick={() => setActiveFilter(f.id)}
                  style={{
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    width:'100%',padding:'8px 10px',borderRadius:'6px',border:'none',
                    background: activeFilter === f.id ? '#6d28d9' : 'transparent',
                    color: activeFilter === f.id ? '#fff' : '#374151',
                    cursor:'pointer',fontSize:'13px',fontWeight: activeFilter === f.id ? '600' : '400',
                    marginBottom:'2px',textAlign:'left'
                  }}>
                  <span>{f.icon} {f.label}</span>
                  {results && <span style={{background: activeFilter === f.id ? 'rgba(255,255,255,0.25)' : '#e5e7eb',borderRadius:'10px',padding:'1px 7px',fontSize:'11px'}}>{count}</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{flex:1}}>
          {loading && <p style={{color:'#9ca3af',padding:'2rem 0'}}>Loading...</p>}

          {!loading && results && (
            <>
              {(activeFilter === 'all' || activeFilter === 'forms') && results.forms?.length > 0 && (
                <div style={{marginBottom:'1.5rem'}}>
                  <h3 style={{fontSize:'14px',fontWeight:'600',color:'#6d28d9',marginBottom:'8px',display:'flex',alignItems:'center',gap:'6px'}}>
                    📋 Forms <span style={{background:'#ede9fe',color:'#6d28d9',borderRadius:'10px',padding:'1px 8px',fontSize:'12px'}}>{results.forms.length}</span>
                  </h3>
                  <div className="table-box">
                    <table>
                      <thead><tr><th>ID</th><th>Title</th><th>Description</th></tr></thead>
                      <tbody>{results.forms.map(f => (
                        <tr key={f.id} style={{cursor:'pointer'}} onClick={() => navigate(`/forms/${f.id}`)}>
                          <td style={{color:'#9ca3af',width:'50px'}}>{f.id}</td>
                          <td style={{fontWeight:'500'}}>{f.title}</td>
                          <td style={{color:'#6b7280'}}>{f.description || '—'}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              )}

              {(activeFilter === 'all' || activeFilter === 'users') && isAdmin && results.users?.length > 0 && (
                <div style={{marginBottom:'1.5rem'}}>
                  <h3 style={{fontSize:'14px',fontWeight:'600',color:'#6d28d9',marginBottom:'8px',display:'flex',alignItems:'center',gap:'6px'}}>
                    👤 Users <span style={{background:'#ede9fe',color:'#6d28d9',borderRadius:'10px',padding:'1px 8px',fontSize:'12px'}}>{results.users.length}</span>
                  </h3>
                  <div className="table-box">
                    <table>
                      <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Active</th></tr></thead>
                      <tbody>{results.users.map(u => (
                        <tr key={u.id}>
                          <td style={{color:'#9ca3af',width:'50px'}}>{u.id}</td>
                          <td style={{fontWeight:'500'}}>{u.first_name} {u.last_name}</td>
                          <td style={{color:'#6b7280'}}>{u.email}</td>
                          <td>{u.is_active ? '✅' : '❌'}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              )}

              {(activeFilter === 'all' || activeFilter === 'questions') && results.questions?.length > 0 && (
                <div style={{marginBottom:'1.5rem'}}>
                  <h3 style={{fontSize:'14px',fontWeight:'600',color:'#6d28d9',marginBottom:'8px',display:'flex',alignItems:'center',gap:'6px'}}>
                    ❓ Questions <span style={{background:'#ede9fe',color:'#6d28d9',borderRadius:'10px',padding:'1px 8px',fontSize:'12px'}}>{results.questions.length}</span>
                  </h3>
                  <div className="table-box">
                    <table>
                      <thead><tr><th>ID</th><th>Question</th><th>Type</th></tr></thead>
                      <tbody>{results.questions.map(q => (
                        <tr key={q.id}>
                          <td style={{color:'#9ca3af',width:'50px'}}>{q.id}</td>
                          <td style={{fontWeight:'500'}}>{q.label}</td>
                          <td style={{color:'#6b7280'}}>{q.type}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeFilter === 'responses' && results.responses?.length > 0 && (
                <div style={{marginBottom:'1.5rem'}}>
                  <h3 style={{fontSize:'14px',fontWeight:'600',color:'#6d28d9',marginBottom:'8px',display:'flex',alignItems:'center',gap:'6px'}}>
                    ✅ Responses <span style={{background:'#ede9fe',color:'#6d28d9',borderRadius:'10px',padding:'1px 8px',fontSize:'12px'}}>{results.responses.length}</span>
                  </h3>
                  <div className="table-box">
                    <table>
                      <thead><tr><th>ID</th><th>Form ID</th><th>Date</th></tr></thead>
                      <tbody>{results.responses.map(r => (
                        <tr key={r.id}>
                          <td style={{color:'#9ca3af',width:'50px'}}>{r.id}</td>
                          <td>{r.formId}</td>
                          <td style={{color:'#6b7280'}}>{new Date(r.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              )}

              {totalResults === 0 && activeFilter !== 'responses' && (
                <div style={{textAlign:'center',padding:'3rem',color:'#9ca3af'}}>
                  <p style={{fontSize:'16px',marginBottom:'8px'}}>No results found</p>
                  <p style={{fontSize:'13px'}}>{query ? `Try a different search term` : 'Start typing to search'}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
