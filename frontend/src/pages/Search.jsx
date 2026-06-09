import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Search() {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) doSearch(query, activeFilter)
  }, [query])

  const doSearch = async (q, type) => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/search?q=${q}${type !== 'all' ? `&type=${type}` : ''}`)
      setResults(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (f) => {
    setActiveFilter(f)
    if (query) doSearch(query, f)
  }

  const filters = ['all', 'forms', 'users', 'questions', 'sections', 'responses']

  return (
    <div>
      <div className="page-header">
        <h1>Results for: "{query}"</h1>
        <p>Search across all lists in the application.</p>
      </div>

      <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'1.5rem'}}>
        {filters.map(f => (
          <button key={f} type="button" onClick={() => handleFilter(f)}
            style={{padding:'4px 14px',borderRadius:'20px',border:'1px solid #d1d5db',
              background: activeFilter === f ? '#6d28d9' : '#fff',
              color: activeFilter === f ? '#fff' : '#374151',
              cursor:'pointer',fontSize:'13px'}}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p style={{color:'#6b7280'}}>Duke kerkuar...</p>}

      {results && (
        <div>
          {results.forms?.length > 0 && (
            <div style={{marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'15px',fontWeight:'600',marginBottom:'.5rem',color:'#6d28d9'}}>Forms ({results.forms.length})</h3>
              <div className="table-box">
                <table><thead><tr><th>ID</th><th>Title</th><th>Description</th></tr></thead>
                <tbody>{results.forms.map(f => (
                  <tr key={f.id} style={{cursor:'pointer'}} onClick={() => navigate(`/forms/${f.id}`)}>
                    <td>{f.id}</td><td>{f.title}</td><td>{f.description}</td>
                  </tr>
                ))}</tbody></table>
              </div>
            </div>
          )}
          {results.users?.length > 0 && (
            <div style={{marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'15px',fontWeight:'600',marginBottom:'.5rem',color:'#6d28d9'}}>Users ({results.users.length})</h3>
              <div className="table-box">
                <table><thead><tr><th>ID</th><th>First Name</th><th>Email</th><th>Active</th></tr></thead>
                <tbody>{results.users.map(u => (
                  <tr key={u.id}><td>{u.id}</td><td>{u.first_name} {u.last_name}</td><td>{u.email}</td><td>{u.is_active ? '✅' : '❌'}</td></tr>
                ))}</tbody></table>
              </div>
            </div>
          )}
          {results.questions?.length > 0 && (
            <div style={{marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'15px',fontWeight:'600',marginBottom:'.5rem',color:'#6d28d9'}}>Questions ({results.questions.length})</h3>
              <div className="table-box">
                <table><thead><tr><th>ID</th><th>Pyetja</th><th>Tipi</th></tr></thead>
                <tbody>{results.questions.map(q => (
                  <tr key={q.id}><td>{q.id}</td><td>{q.label}</td><td>{q.type}</td></tr>
                ))}</tbody></table>
              </div>
            </div>
          )}
          {results.sections?.length > 0 && (
            <div style={{marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'15px',fontWeight:'600',marginBottom:'.5rem',color:'#6d28d9'}}>Sections ({results.sections.length})</h3>
              <div className="table-box">
                <table><thead><tr><th>ID</th><th>Title</th><th>Form ID</th></tr></thead>
                <tbody>{results.sections.map(s => (
                  <tr key={s.id}><td>{s.id}</td><td>{s.title}</td><td>{s.formId}</td></tr>
                ))}</tbody></table>
              </div>
            </div>
          )}
          {results.responses?.length > 0 && (
            <div style={{marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'15px',fontWeight:'600',marginBottom:'.5rem',color:'#6d28d9'}}>Responses ({results.responses.length})</h3>
              <div className="table-box">
                <table><thead><tr><th>ID</th><th>Form ID</th><th>Data</th></tr></thead>
                <tbody>{results.responses.map(r => (
                  <tr key={r.id}><td>{r.id}</td><td>{r.formId}</td><td>{new Date(r.createdAt).toLocaleDateString()}</td></tr>
                ))}</tbody></table>
              </div>
            </div>
          )}
          {Object.values(results).every(arr => !arr?.length) && (
            <p style={{color:'#6b7280',textAlign:'center',padding:'2rem'}}>No results found for "{query}"</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
