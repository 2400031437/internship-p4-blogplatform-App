import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import { URL } from '../url'

export default function Menu({ close }) {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(URL + '/api/auth/logout', { withCredentials: true })
    } catch (err) {
      console.log(err)
    }
    setUser(null)
    close()
    navigate('/login')
  }

  const item = 'cursor-pointer px-2 py-1 text-sm text-white hover:text-gray-400 md:text-base'

  return (
    <div className="absolute right-6 top-12 z-10 flex w-[200px] flex-col items-start space-y-4 rounded-md bg-black p-4 md:right-32">
      {!user && (
        <>
          <Link to="/login" onClick={close} className={item}>Login</Link>
          <Link to="/register" onClick={close} className={item}>Register</Link>
        </>
      )}
      {user && (
        <>
          <Link to={'/profile/' + user._id} onClick={close} className={item}>Profile</Link>
          <Link to="/write" onClick={close} className={item}>Write</Link>
          <Link to={'/myblogs/' + user._id} onClick={close} className={item}>My blogs</Link>
          <h3 onClick={handleLogout} className={item}>Logout</h3>
        </>
      )}
    </div>
  )
}
