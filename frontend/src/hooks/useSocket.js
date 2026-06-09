import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export const useSocket = () => {
  const socketRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    socketRef.current = io('http://localhost:5000', {
      auth: { token }
    })

    return () => socketRef.current?.disconnect()
  }, [])

  return socketRef.current
}