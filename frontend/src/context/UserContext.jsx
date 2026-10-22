import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { URL } from '../url'

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // On every page refresh ask the backend "who am I?" using the cookie,
  // so the user stays logged in.
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(URL + '/api/auth/refetch', { withCredentials: true })
        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }
    getUser()
  }, [])

  return <UserContext.Provider value={{ user, setUser, authLoading }}>{children}</UserContext.Provider>
}
