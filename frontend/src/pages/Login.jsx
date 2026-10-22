import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { URL, errMsg } from '../url'
import { UserContext } from '../context/UserContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post(URL + '/api/auth/login', { email, password }, { withCredentials: true })
      setUser(res.data)
      navigate('/')
    } catch (err) {
      setError(errMsg(err, 'Login failed'))
    }
  }

  const input = 'w-full border-2 border-black px-4 py-2 outline-0'

  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <form onSubmit={handleLogin} className="flex w-[80%] flex-col items-center justify-center space-y-4 md:w-[25%]">
        <h1 className="text-left text-xl font-bold">Log in to your account</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className={input} type="email" placeholder="Enter your email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} className={input} type="password" placeholder="Enter your password" required />
        <button type="submit" className="w-full rounded-lg bg-black px-4 py-4 text-lg font-bold text-white hover:bg-gray-500 hover:text-black">
          Log in
        </button>
        {error && <h3 className="text-sm text-red-500">{error}</h3>}
        <div className="flex items-center justify-center space-x-3">
          <p>New here?</p>
          <p className="text-gray-500 hover:text-black"><Link to="/register">Register</Link></p>
        </div>
      </form>
    </div>
  )
}
