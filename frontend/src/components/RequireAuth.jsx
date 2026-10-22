import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import Loader from './Loader'

// Only logged-in users can open these pages, others are sent to the login page.
export default function RequireAuth({ children }) {
  const { user, authLoading } = useContext(UserContext)
  if (authLoading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  return children
}
