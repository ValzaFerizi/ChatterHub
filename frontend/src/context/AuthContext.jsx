import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/me')
      setUser(res.data)
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password })
    const { accessToken, refreshToken } = res.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    await fetchProfile()
    return res.data
  }

  const register = async (first_name, last_name, email, password) => {
    const res = await axios.post('/api/auth/register', { first_name, last_name, email, password })
    return res.data
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch {
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
