import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { URL, errMsg } from '../url'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post(URL + '/api/auth/register', { username, email, password })
      navigate('/login')
    } catch (err) {
      setError(errMsg(err, 'Something went wrong'))
    }
  }

  const input = 'w-full border-2 border-black px-4 py-2 outline-0'

  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <form onSubmit={handleRegister} className="flex w-[80%] flex-col items-center justify-center space-y-4 md:w-[25%]">
        <h1 className="text-left text-xl font-bold">Create an account</h1>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className={input} type="text" placeholder="Enter your username" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} className={input} type="email" placeholder="Enter your email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} className={input} type="password" placeholder="Enter your password (min 4)" required />
        <button type="submit" className="w-full rounded-lg bg-black px-4 py-4 text-lg font-bold text-white hover:bg-gray-500 hover:text-black">
          Register
        </button>
        {error && <h3 className="text-sm text-red-500">{error}</h3>}
        <div className="flex items-center justify-center space-x-3">
          <p>Already have an account?</p>
          <p className="text-gray-500 hover:text-black"><Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  )
}
