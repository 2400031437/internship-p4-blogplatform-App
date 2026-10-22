import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { URL, errMsg } from '../url'
import { UserContext } from '../context/UserContext'
import PostCard from '../components/PostCard'

export default function Profile() {
  const { id: paramId } = useParams()
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [posts, setPosts] = useState([])
  const [updated, setUpdated] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(URL + '/api/users/' + paramId)
        setUsername(res.data.username)
        setEmail(res.data.email)
        const p = await axios.get(URL + '/api/posts/user/' + paramId)
        setPosts(p.data)
      } catch (err) {
        console.log(err)
      }
    }
    load()
  }, [paramId])

  const handleUserUpdate = async () => {
    setUpdated(false)
    setError('')
    try {
      const body = { username, email }
      if (password) body.password = password // leave empty to keep the old password
      const res = await axios.put(URL + '/api/users/' + user._id, body, { withCredentials: true })
      setUser({ _id: res.data._id, username: res.data.username, email: res.data.email })
      setPassword('')
      setUpdated(true)
    } catch (err) {
      setError(errMsg(err, 'Could not update the profile'))
    }
  }

  const handleUserDelete = async () => {
    if (!window.confirm('Delete your account together with all your posts and comments?')) return
    try {
      await axios.delete(URL + '/api/users/' + user._id, { withCredentials: true })
      setUser(null)
      navigate('/')
    } catch (err) {
      setError(errMsg(err, 'Could not delete the account'))
    }
  }

  const input = 'px-4 py-2 text-gray-500 outline-none border border-gray-200'
  const btn = 'cursor-pointer bg-black px-4 py-2 font-semibold text-white hover:bg-gray-400 hover:text-black'

  return (
    <div className="mt-8 flex flex-col-reverse px-8 md:flex-row md:items-start md:px-[200px]">
      <div className="flex w-full flex-col md:w-[70%] md:pr-8">
        <h1 className="mb-4 text-xl font-bold">Your posts:</h1>
        {posts.length === 0 && <p className="text-gray-500">No posts yet.</p>}
        {posts.map((p) => <PostCard key={p._id} post={p} />)}
      </div>

      <div className="mb-8 flex w-full flex-col space-y-4 md:sticky md:top-16 md:mb-0 md:w-[30%] md:items-end">
        <div className="flex w-full flex-col space-y-4">
          <h1 className="mb-2 text-xl font-bold">Profile</h1>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className={input} placeholder="Your username" type="text" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={input} placeholder="Your email" type="email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="New password (optional)" type="password" />
          <div className="mt-4 flex items-center space-x-4">
            <button onClick={handleUserUpdate} className={btn}>Update</button>
            <button onClick={handleUserDelete} className={btn}>Delete</button>
          </div>
          {error && <h3 className="mt-2 text-center text-sm text-red-500">{error}</h3>}
          {updated && <h3 className="mt-4 text-center text-sm text-green-500">User updated successfully!</h3>}
        </div>
      </div>
    </div>
  )
}
